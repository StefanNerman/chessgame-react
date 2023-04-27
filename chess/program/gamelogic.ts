import { playerColor, setPlayerColor, isLocalGame } from './ChessComponent'
import MoveFinder, { moveOutcomes } from './moveFinder'

/*===================================================================

PIECE ID's:

-first number = color (0 for black, 1 for white)

-second number = piece type:
    pawn 0
    tower 1 
    knight 2
    bishop 3
    qeen 4
    king 5

-third number = index

ex. black knight = 020 or 021
ex. white pawn = 100 101 102 103 104 105 106 107
ex. black king = 050

ARRAY WITH HARDCODED START POSITIONS:
{position:11, piece:'110', color:'black'},{position:12, piece:'120', color:'white'},{position:13, piece:'130', color:'black'},{position:14, piece:'150', color:'white'},{position:15, piece:'140', color:'black'},{position:16, piece:'131', color:'white'},{position:17, piece:'121', color:'black'},{position:18, piece:'111', color:'white'},
{position:21, piece:'100', color:'white'},{position:22, piece:'101', color:'black'},{position:23, piece:'102', color:'white'},{position:24, piece:'103', color:'black'},{position:25, piece:'104', color:'white'},{position:26, piece:'105', color:'black'},{position:27, piece:'106', color:'black'},{position:28, piece:'107', color:'black'},
        
{position:31, piece:false, color:'black'},{position:32, piece:false, color:'white'},{position:33, piece:false, color:'black'},{position:34, piece:false, color:'white'},{position:35, piece:false, color:'black'},{position:36, piece:false, color:'white'},{position:37, piece:false, color:'black'},{position:38, piece:false, color:'white'},
{position:41, piece:false, color:'white'},{position:42, piece:false, color:'black'},{position:43, piece:false, color:'white'},{position:44, piece:false, color:'black'},{position:45, piece:false, color:'white'},{position:46, piece:false, color:'black'},{position:47, piece:false, color:'white'},{position:48, piece:false, color:'black'},
{position:51, piece:false, color:'black'},{position:52, piece:false, color:'white'},{position:53, piece:false, color:'black'},{position:54, piece:false, color:'white'},{position:55, piece:false, color:'black'},{position:56, piece:false, color:'white'},{position:57, piece:false, color:'black'},{position:58, piece:false, color:'white'},
{position:61, piece:false, color:'white'},{position:62, piece:false, color:'black'},{position:63, piece:false, color:'white'},{position:64, piece:false, color:'black'},{position:65, piece:false, color:'white'},{position:66, piece:false, color:'black'},{position:67, piece:false, color:'white'},{position:68, piece:false, color:'black'},
        
{position:71, piece:'000', color:'black'},{position:72, piece:'001', color:'white'},{position:73, piece:'002', color:'black'},{position:74, piece:'003', color:'white'},{position:75, piece:'004', color:'black'},{position:76, piece:'005', color:'white'},{position:77, piece:'006', color:'black'},{position:78, piece:'007', color:'white'},
{position:81, piece:'010', color:'white'},{position:82, piece:'020', color:'black'},{position:83, piece:'030', color:'white'},{position:84, piece:'050', color:'black'},{position:85, piece:'040', color:'white'},{position:86, piece:'031', color:'black'},{position:87, piece:'021', color:'white'},{position:88, piece:'011', color:'black'},

=====================================================================*/

const startPositions: Array<TileObj> = [
    {position:11, piece:'110', color:'black'},{position:12, piece:'120', color:'white'},{position:13, piece:'130', color:'black'},{position:14, piece:'150', color:'white'},{position:15, piece:'140', color:'black'},{position:16, piece:'131', color:'white'},{position:17, piece:'121', color:'black'},{position:18, piece:'111', color:'white'},
    {position:21, piece:'100', color:'white'},{position:22, piece:'101', color:'black'},{position:23, piece:'102', color:'white'},{position:24, piece:'103', color:'black'},{position:25, piece:'104', color:'white'},{position:26, piece:'105', color:'black'},{position:27, piece:'106', color:'black'},{position:28, piece:'107', color:'black'},
            
    {position:31, piece:false, color:'black'},{position:32, piece:false, color:'white'},{position:33, piece:false, color:'black'},{position:34, piece:false, color:'white'},{position:35, piece:false, color:'black'},{position:36, piece:false, color:'white'},{position:37, piece:false, color:'black'},{position:38, piece:false, color:'white'},
    {position:41, piece:false, color:'white'},{position:42, piece:false, color:'black'},{position:43, piece:false, color:'white'},{position:44, piece:false, color:'black'},{position:45, piece:false, color:'white'},{position:46, piece:false, color:'black'},{position:47, piece:false, color:'white'},{position:48, piece:false, color:'black'},
    {position:51, piece:false, color:'black'},{position:52, piece:false, color:'white'},{position:53, piece:false, color:'black'},{position:54, piece:false, color:'white'},{position:55, piece:false, color:'black'},{position:56, piece:false, color:'white'},{position:57, piece:false, color:'black'},{position:58, piece:false, color:'white'},
    {position:61, piece:false, color:'white'},{position:62, piece:false, color:'black'},{position:63, piece:false, color:'white'},{position:64, piece:false, color:'black'},{position:65, piece:false, color:'white'},{position:66, piece:false, color:'black'},{position:67, piece:false, color:'white'},{position:68, piece:false, color:'black'},
            
    {position:71, piece:'000', color:'black'},{position:72, piece:'001', color:'white'},{position:73, piece:'002', color:'black'},{position:74, piece:'003', color:'white'},{position:75, piece:'004', color:'black'},{position:76, piece:'005', color:'white'},{position:77, piece:'006', color:'black'},{position:78, piece:'007', color:'white'},
    {position:81, piece:'010', color:'white'},{position:82, piece:'020', color:'black'},{position:83, piece:'030', color:'white'},{position:84, piece:'050', color:'black'},{position:85, piece:'040', color:'white'},{position:86, piece:'031', color:'black'},{position:87, piece:'021', color:'white'},{position:88, piece:'011', color:'black'},
]

interface TileObj {
    position: number,
    piece: string | any,
    color: string
}

class Tiles {

    public positions: Array<TileObj> = structuredClone(startPositions)

    public hasWhiteKingMoved: boolean = false
    public hasBlackKingMoved: boolean = false

    changePosition(from: number, to: number){
        if(whoseTurn === 'white') whoseTurn = 'black'
        else whoseTurn = 'white'
        let movePiece = ''
        this.positions.forEach((e, i) => {
            if(e.position === from) {
                movePiece = e.piece
                this.positions[i].piece = false
            }
        })
        if(movePiece.slice(1, 2) === '5' && movePiece.slice(0, 1) === '0') this.hasBlackKingMoved = true
        if(movePiece.slice(1, 2) === '5' && movePiece.slice(0, 1) === '1') this.hasWhiteKingMoved = true
        this.positions.forEach((e, i) => {
            if(e.position === to){
                this.positions[i].piece = movePiece
            }
        })
        if(isLocalGame){
            playerColor === 'white' ? setPlayerColor('black') : setPlayerColor('white')
        }
    }

    castle(row: number, side: string){
        if(whoseTurn === 'white') whoseTurn = 'black'
        else whoseTurn = 'white'
        let clr = row === 1 ? '1' : '0'
        if(side === 'right'){
            this.positions.forEach((e, i) => {
                if(e.position === parseInt(`${row}4`)) this.positions[i].piece = false
                if(e.position === parseInt(`${row}1`)) this.positions[i].piece = false
                if(e.position === parseInt(`${row}2`)) this.positions[i].piece = `${clr}50`
                if(e.position === parseInt(`${row}3`)) this.positions[i].piece = `${clr}11`
            })
        }
        if(side === 'left'){
            this.positions.forEach((e, i) => {
                if(e.position === parseInt(`${row}4`)) this.positions[i].piece = false
                if(e.position === parseInt(`${row}8`)) this.positions[i].piece = false
                if(e.position === parseInt(`${row}6`)) this.positions[i].piece = `${clr}50`
                if(e.position === parseInt(`${row}5`)) this.positions[i].piece = `${clr}11`
            })
        }
        if(isLocalGame){
            playerColor === 'white' ? setPlayerColor('black') : setPlayerColor('white')
        }
    }

    getPositions(){
        return this.positions
    }

    getTileInfo(tileId: number):TileObj | undefined{
        let tile 
        this.positions.forEach(e => {if(e.position === tileId) tile = e})
        return tile
    }

    getTileByPiece(piece: string):TileObj | undefined{
        let tile
        this.positions.forEach(e => {
            if(e.piece === piece) tile = e
        })
        return tile
    }
}

export let selectedTile: object | undefined = undefined
const selectedFrame = document.createElement('div')
selectedFrame.classList.add('greentileframe')

export let tiles = new Tiles()

export let whoseTurn = 'white'  
export function setWhoseTurn(str: string){whoseTurn = str}

interface actionMoveInfoObj {
    moveAction: string,
    move: string | null
}

interface actionInfoObj {
    action: string,
    info: string | null | actionMoveInfoObj | moveOutcomeObj
}

interface illegalMoveCheckObj {
    moveStatus: boolean,
    message: actionInfoObj
}

interface moveOutcomeObj {
    move:string,
    outcome:string
}

export function tileClick(number: number, letter: number){
    if(selectedTile) return movePieceEvent(number, letter)
    let tile: TileObj | undefined = tiles.getTileInfo(parseInt(`${number}${letter}`))
    if(!tile?.piece) return {action: 'none', info: null}
    let pieceClr = tile?.piece.slice(0, 1)
    if(playerColor === 'white' && pieceClr === '0') return {action: 'none', info: null}
    if(playerColor === 'black' && pieceClr === '1') return {action: 'none', info: null}
    if(tile && (tile as any).piece !== false) return selectTileEvent(number, letter)   
    return {action: 'none', info: null}
}


//this funciton makes the move provided in parameters and triggers all the move-handling functions
//Note: you can move any piece wherever you want there is no legal move checking function to prevent it
export function autoMove(from: number, to: number): actionInfoObj{
    if(moveIsToCastle(from, to, tiles.getTileInfo(from))) return {action: 'move', info: castlingMove(from, to)}
    let outcome = getAutoMoveOutcome(from, to, true)
    tiles.changePosition(from, to)
    if(isCheckMate(whoseTurn === 'white' ? '0' : '1')){
        outcome.outcomeName = 'checkmate'
        outcome.move = outcome.move.replace('*', 'x')
    } 
    return {action: 'move', info: {moveAction: outcome.outcomeName, move: outcome.move + `${from}${to}`}}
}
function getAutoMoveOutcome(from: number, to: number, isDefenseCheck: boolean){
    let moveOutcome: moveOutcomeObj = MoveFinder.findMoveOutcome(from, to, isDefenseCheck)
    let outName = 'move'
    if(moveOutcome.outcome.includes('<')) outName = 'eat'
    if(moveOutcome.outcome.includes('*')) outName = 'check'
    return {
        outcomeName: outName,
        move: moveOutcome.outcome
    }
}


function movePieceEvent(number: number, letter: number){
    if((selectedTile as any).position === parseInt(`${number}${letter}`)) {
        unselectTile(parseInt(`${number}${letter}`))
        selectedTile = undefined
        return {action: 'unselect', info: null}
    }
    let moveCheck: illegalMoveCheckObj = legalMoveCheck((selectedTile as any).position, parseInt(`${number}${letter}`))
    if (!moveCheck.moveStatus){
        selectedTile = undefined
        return moveCheck.message
    }
    let move: actionMoveInfoObj = movePiece(number, letter)
    selectedTile = undefined
    return {action: 'move', info: move}
}
function legalMoveCheck(from: number, to: number){
    let checkMove = moveOutcomes.includes(to)
    unselectTile(from)
    return {
        moveStatus: checkMove,
        message: {
            action: 'illegal', info: 'no' 
        }
    }
}

function movePiece(number: number, letter: number){
    if(moveIsToCastle((selectedTile as any).position, parseInt(`${number}${letter}`), selectedTile)) return castlingMove((selectedTile as any).position, parseInt(`${number}${letter}`))
    let outcome = getMoveOutcome((selectedTile as any).position, parseInt(`${number}${letter}`))
    tiles.changePosition((selectedTile as any).position, parseInt(`${number}${letter}`))
    if(isCheckMate(whoseTurn === 'white' ? '1' : '0')){
        outcome.outcomeName = 'checkmate'
        outcome.move = outcome.move.replace('*', 'x')
    } 
    unselectTile((selectedTile as any).position)
    let out = {
        moveAction: outcome.outcomeName,
        move: outcome.move + `${(selectedTile as any).position}${number}${letter}`,
    }
    if(out.move.slice(0, 2) === out.move.slice(3, 5)) out.moveAction = 'unselect'
    return out
}
function getMoveOutcome(from: number, to: number){
    let moveOutcome: moveOutcomeObj = MoveFinder.findMoveOutcome(from, to, false)
    let outName = 'move'
    if(moveOutcome.outcome.includes('<')) outName = 'eat'
    if(moveOutcome.outcome.includes('*')) outName = 'check'
    return {
        outcomeName: outName,
        move: moveOutcome.outcome
    }
}
function isCheckMate(defenseColor: string): boolean {
    let possibleMoves: Array<number | undefined> = []
    tiles.getPositions().forEach(e => {
        if(e.piece && e.piece.slice(0, 1) === defenseColor){
            !isLocalGame && setPlayerColor(playerColor === 'white' ? 'black' : 'white')
            possibleMoves = [...possibleMoves, ...findPossibleMoves(e.piece, true)]
            !isLocalGame && setPlayerColor(playerColor === 'white' ? 'black' : 'white')
        }
    })
    if(possibleMoves && possibleMoves.length > 0) return false
    return true
}


function moveIsToCastle(from: number, to: number, movePiece: object | undefined): boolean{
    if((movePiece as any).piece.slice(1, 2) !== '5') return false
    if(from !== 14 && (movePiece as any).piece.slice(0, 1) !== '0') return false
    if(from !== 84 && (movePiece as any).piece.slice(0, 1) !== '1') return false
    if((movePiece as any).piece.slice(0, 1) === '1' && (to === 11 || to === 18)) return true
    if((movePiece as any).piece.slice(0, 1) === '0' && (to === 81 || to === 88)) return true
    return false
}
function castlingMove(from: number, to: number): actionMoveInfoObj{
    let out: actionMoveInfoObj = {moveAction:'',move:''}
    if(to === 11 || to === 81) out = castleRightSide(parseInt(from.toString().slice(0, 1)))
    if(to === 18 || to === 88) out = castleLeftSide(parseInt(from.toString().slice(0, 1)))
    return out
}
function castleRightSide(row: number): actionMoveInfoObj{
    tiles.castle(row, 'right')
    let clr = row === 1 ? '1' : '0'
    let outStr = `${clr}50:${clr}11`
    return {
        moveAction: 'move',
        move: outStr + `${row === 1 ? 14 : 84}${row === 1 ? 11 : 81}`
    }
}
function castleLeftSide(row: number): actionMoveInfoObj{
    tiles.castle(row, 'left')
    let clr = row === 1 ? '1' : '0'
    let outStr = `${clr}50:${clr}10`
    return {
        moveAction: 'move',
        move: outStr + `${row === 1 ? 14 : 84}${row === 1 ? 18 : 88}`
    }
}


function unselectTile(tile: number){
    removeMoveOptionDots()
    const tileElement = document.getElementById(`tile-${tile}`)
    if (tileElement?.children && tileElement?.children.length > 1) {
        tileElement.removeChild(selectedFrame)
    }
}
function removeMoveOptionDots(){
    tiles.getPositions().forEach(e => {
        let tile = document.getElementById('tile-'+e.position)
        tile?.classList.remove('moveoption-dots')
    })
}


function selectTileEvent(number: number, letter: number){
    let tile: object | undefined = tiles.getTileInfo(parseInt(`${number}${letter}`))
    let piece = tiles.getTileInfo(parseInt(`${number}${letter}`))?.piece
    selectedTile = tile
    if(piece) findPossibleMoves(piece, false)
    handleSelectedTiles(document.getElementById(`tile-${number}${letter}`))
    return {action: 'select', info: `${number}${letter}`}
}
function handleSelectedTiles(tile: HTMLElement | null){
    tile?.appendChild(selectedFrame)
}
function findPossibleMoves(piece: string, isCheckMateCheck: boolean): Array<number | undefined>{
    let possible: Array<number | undefined> = []
    let pieceType = ''
    if(piece) pieceType = (piece as any).slice(1, 2)
    if(pieceType === '0') possible = MoveFinder.getPawnMoves(piece)
    if(pieceType === '1') possible = MoveFinder.getTowerMoves(piece)
    if(pieceType === '2') possible = MoveFinder.getKnightMoves(piece)
    if(pieceType === '3') possible = MoveFinder.getBishopMoves(piece)
    if(pieceType === '4') possible = MoveFinder.getQueenMoves(piece)
    if(pieceType === '5') possible = MoveFinder.getKingMoves(piece)
    let pieceTile = isCheckMateCheck ? tiles.getTileByPiece(piece) : selectedTile
    let legalMoves = MoveFinder.getCheckProofMoves(pieceTile, possible)
    !isCheckMateCheck && addMoveOptionDots(legalMoves)
    if(isCheckMateCheck) return legalMoves
    return possible
}
function addMoveOptionDots(positions: Array<number | undefined>){
    positions.forEach(e => {
        let tile = document.getElementById('tile-'+tiles.getTileInfo((e as any))?.position)
        tile?.classList.add('moveoption-dots')
    })
}

