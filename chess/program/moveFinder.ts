import { tiles } from './gamelogic'
import { playerColor } from './ChessComponent'

class MoveFinder {

    getPawnMoves(piece: string): Array<number | undefined> {
        let tile: TileObj = {position:11, piece: '000', color: 'white'}
        tiles.getPositions().forEach(e => {if(e.piece === piece) tile = e})
        return pawnMoves(tile)
    }
    
    getTowerMoves(piece: string): Array<number | undefined> {
        let tile: TileObj = {position:11, piece: '000', color: 'white'}
        tiles.getPositions().forEach(e => {if(e.piece === piece) {tile = e}})
        return towerMoves(tile)
    }
    
    getKnightMoves(piece: string): Array<number | undefined> {
        let tile: TileObj = {position:11, piece: '000', color: 'white'}
        tiles.getPositions().forEach(e => {if(e.piece === piece) tile = e})
        return knightMoves(tile)
    }
    
    getBishopMoves(piece: string): Array<number | undefined> {
        let tile: TileObj = {position:11, piece: '000', color: 'white'}
        tiles.getPositions().forEach(e => {if(e.piece === piece) tile = e})
        return bishopMoves(tile)
    }
    
    getQueenMoves(piece: string): Array<number | undefined> {
        let tile: TileObj = {position:11, piece: '000', color: 'white'}
        tiles.getPositions().forEach(e => {if(e.piece === piece) tile = e})
        return queenMoves(tile)
    }
    
    getKingMoves(piece: string): Array<number | undefined> {
        let tile: TileObj = {position:11, piece: '000', color: 'white'}
        tiles.getPositions().forEach(e => {if(e.piece === piece) tile = e})
        return kingMoves(tile)
    }
    
    getCheckProofMoves(piece: object | undefined, moves: Array<number | undefined>): Array<number | undefined>{
        let checkProofMoves: Array<number | undefined> = []
        moves.forEach(e => {
            if(!doesItResultInCheck(piece, e, true)) checkProofMoves.push(e)
        })
        moveOutcomes = checkProofMoves
        return checkProofMoves
    }

    findMoveOutcome(from: number, to: number, isDefenseCheck: boolean): moveOutcomeObj{
        let out = findMoveOutcome(from, to, isDefenseCheck)
        return out
    }

}



interface moveOutcomeObj {
    move:string,
    outcome:string
}

interface TileObj {
    position: number,
    piece: string | any,
    color: string
}

let moveFinder = new MoveFinder()
export default moveFinder

export let moveOutcomes: Array<number | undefined> = []



function findMoveOutcome(from: number, to: number, isDefenseCheck: boolean){
    let movePiece = tiles.getTileInfo(from)
    let moveDestination = tiles.getTileInfo(to)
    let isCheck = doesItResultInCheck(movePiece, to, isDefenseCheck) ? '*' : ''
    let eat = moveDestination?.piece ? moveDestination.piece : movePiece?.piece
    let sign = moveDestination?.piece ? '<' : '>'
    let out = movePiece?.piece + sign + eat + isCheck
    return {move: `${from}${to}`, outcome: out}
}


//Creates a copy of the "tiles.positions" array and makes the desired move so that the code can simulate what would happen after the move.
function makeSimulatorMove(movePiece: object | undefined, to: number | undefined): Array<TileObj>{
    let simulatorGameStatus: Array<TileObj> = structuredClone(tiles.getPositions())
    simulatorGameStatus.forEach((e, i) => {
        if(e.position === (movePiece as any).position) simulatorGameStatus[i].piece = false
        if(e.position === to) simulatorGameStatus[i].piece = (movePiece as any).piece
    })
    return simulatorGameStatus
}
function findTileInSimulator(position: number, simulation: Array<TileObj>): TileObj | undefined{
    let tile 
    simulation.forEach(e => {if(e.position === position) tile = e})
    return tile
}



function doesItResultInCheck(movePiece: object | undefined, to: number | undefined, isDefenseCheck: boolean): boolean{
    let simulatorGameStatus: Array<TileObj> = makeSimulatorMove(movePiece, to)
    return isKingInDanger(simulatorGameStatus, playerColor, isDefenseCheck)
}

//Use isDefenseCheck = true when checking if a particular move will expose the king fo the same color to an attack
//Use isDefenseCheck = false when checking if an attacking move checks the other color's king
function isKingInDanger(boardStatus: Array<TileObj>, color: string, isDefenseCheck: boolean): boolean {
    let kingTile: TileObj = {position: 11, piece: '050', color: 'black'}
    let kingStr: string
    if(isDefenseCheck && color === 'white') kingStr = '150'
    if(isDefenseCheck && color === 'black') kingStr = '050'
    if(!isDefenseCheck && color === 'white') kingStr = '050'
    if(!isDefenseCheck && color === 'black') kingStr = '150'
    boardStatus.forEach(e => {if(e.piece === kingStr) kingTile = e})
    if(checkKingAttackLines(kingTile, boardStatus, isDefenseCheck)) return true
    if(checkKingAttackDots(kingTile, boardStatus, isDefenseCheck)) return true
    return false
}
function checkKingAttackLines(kingTile: TileObj, boardStatus: Array<TileObj>, isDefenseCheck: boolean): boolean{
    if(!checkLineSimulate(kingTile, 1, 1, boardStatus, isDefenseCheck)) return true
    if(!checkLineSimulate(kingTile, -1, 1, boardStatus, isDefenseCheck)) return true
    if(!checkLineSimulate(kingTile, 1, -1, boardStatus, isDefenseCheck)) return true
    if(!checkLineSimulate(kingTile, -1, -1, boardStatus, isDefenseCheck)) return true
    if(!checkLineSimulate(kingTile, 1, 0, boardStatus, isDefenseCheck)) return true
    if(!checkLineSimulate(kingTile, 0, 1, boardStatus, isDefenseCheck)) return true
    if(!checkLineSimulate(kingTile, -1, 0, boardStatus, isDefenseCheck)) return true
    if(!checkLineSimulate(kingTile, 0, -1, boardStatus, isDefenseCheck)) return true
    return false
}
function checkKingAttackDots(kingTile: TileObj, boardStatus: Array<TileObj>, isDefenseCheck: boolean): boolean{
    let attackerColor = kingTile.piece.slice(0, 1) 
    if(!checkDotSimulate(kingTile, 1, 1, boardStatus, isDefenseCheck, attackerColor === '1')) return true
    if(!checkDotSimulate(kingTile, -1, 1, boardStatus, isDefenseCheck, attackerColor === '1')) return true
    if(!checkDotSimulate(kingTile, 1, -1, boardStatus, isDefenseCheck, attackerColor === '0')) return true
    if(!checkDotSimulate(kingTile, -1, -1, boardStatus, isDefenseCheck, attackerColor === '0')) return true
    if(!checkDotSimulate(kingTile, 2, 1, boardStatus, isDefenseCheck, false)) return true
    if(!checkDotSimulate(kingTile, 1, 2, boardStatus, isDefenseCheck, false)) return true
    if(!checkDotSimulate(kingTile, -2, 1, boardStatus, isDefenseCheck, false)) return true
    if(!checkDotSimulate(kingTile, -1, 2, boardStatus, isDefenseCheck, false)) return true
    if(!checkDotSimulate(kingTile, -2, -1, boardStatus, isDefenseCheck, false)) return true
    if(!checkDotSimulate(kingTile, -1, -2, boardStatus, isDefenseCheck, false)) return true
    if(!checkDotSimulate(kingTile, 2, -1, boardStatus, isDefenseCheck, false)) return true
    if(!checkDotSimulate(kingTile, 1, -2, boardStatus, isDefenseCheck, false)) return true
    if(!checkDotSimulate(kingTile, 1, 0, boardStatus, isDefenseCheck, false)) return true
    if(!checkDotSimulate(kingTile, -1, 0, boardStatus, isDefenseCheck, false)) return true
    if(!checkDotSimulate(kingTile, 0, 1, boardStatus, isDefenseCheck, false)) return true
    if(!checkDotSimulate(kingTile, 0, -1, boardStatus, isDefenseCheck, false)) return true
    return false
}

//checkLine is for checking line attacking pieces like: queen, tower, bishop
//checkDot is for checking for dot attacking pieces like: pawn, king, knight
//When using checkDot, if you are checking for knight or king attack dots pass the isPawn parameter as false.
function checkLineSimulate(piece: TileObj, xDirection: number, yDirection: number, boardStatus: Array<TileObj>, isDefenseCheck: boolean): boolean{
    let isTower = false
    if(yDirection === 0 || xDirection === 0) isTower = true
    let x = parseInt(piece.position.toString().slice(1,2))
    let y = parseInt(piece.position.toString().slice(0,1))
    for(let i = 0; i < 8; i++){
        x += xDirection
        y += yDirection
        if(x < 1 || x > 8 || y < 1 || y > 8) break
        let tile = findTileInSimulator(parseInt(`${y}${x}`), boardStatus)
        if(tile?.piece){
            let tileOutcomeStatus =  checkLineTileOutcome(piece, tile, isTower, isDefenseCheck)
            if(!tileOutcomeStatus) return false
            else break
        }
    }
    return true
}
function checkLineTileOutcome(piece: TileObj, tile: TileObj, isTower: boolean, isDefenseCheck: boolean): boolean{
    let tileType = tile?.piece.slice(1, 2)
    if(isDefenseCheck && tile?.piece.slice(0, 1) === '1' && playerColor === 'white') return true
    if(isDefenseCheck && tile?.piece.slice(0, 1) === '0' && playerColor === 'black') return true
    if(!isDefenseCheck && tile?.piece.slice(0, 1) === '1' && playerColor === 'black') return true
    if(!isDefenseCheck && tile?.piece.slice(0, 1) === '0' && playerColor === 'white') return true
    if(piece.piece.slice(1, 2) === '5'){
        if(tileType === '4') return false
        if(!isTower && tileType === '3') return false
        if(isTower && tileType === '1') return false
    }
    return true
}
function checkDotSimulate(piece: TileObj, xDirection: number, yDirection: number, boardStatus: Array<TileObj>, isDefenseCheck: boolean, isPawn: boolean): boolean{
    let x = parseInt(piece.position.toString().slice(1,2)) + xDirection
    let y = parseInt(piece.position.toString().slice(0,1)) + yDirection
    if(x < 1 || x > 8 || y < 1 || y > 8) return true
    let tile = findTileInSimulator(parseInt(`${y}${x}`), boardStatus)
    if(tile?.piece){
        let tileOutcomeStatus = checkDotTileOutcome(piece, tile, isPawn, isDefenseCheck)
        if(!tileOutcomeStatus) return false
        else if(piece.piece.slice(1, 2) === '5') return true
    }
    return true
}
function checkDotTileOutcome(piece: TileObj, tile: TileObj, isPawn: boolean, isDefenseCheck: boolean): boolean{
    let tileType = tile?.piece.slice(1, 2)
    if(isDefenseCheck && tile?.piece.slice(0, 1) === '1' && playerColor === 'white') return true
    if(isDefenseCheck && tile?.piece.slice(0, 1) === '0' && playerColor === 'black') return true
    if(!isDefenseCheck && tile?.piece.slice(0, 1) === '1' && playerColor === 'black') return true
    if(!isDefenseCheck && tile?.piece.slice(0, 1) === '0' && playerColor === 'white') return true
    if(piece.piece.slice(1, 2) === '5'){
        if(tileType === '2' && !isPawn) return false
        if((tileType === '0' || tileType === '5') && isPawn) return false
    }
    return true
}



function checkLineMove(piece: number, xDirection: number, yDirection: number): Array<number | undefined> {
    let possibleMoves: Array<number | undefined> = []
    let x = parseInt(piece.toString().slice(1,2))
    let y = parseInt(piece.toString().slice(0,1))
    for(let i = 0; i < 8; i++){
        x += xDirection
        y += yDirection
        if(x < 1 || x > 8 || y < 1 || y > 8) break
        let tile = tiles.getTileInfo(parseInt(`${y}${x}`))
        if(tile?.piece){
            if(tile?.piece.slice(0, 1) === '1' && playerColor === 'white') break
            if(tile?.piece.slice(0, 1) === '0' && playerColor === 'black') break
            possibleMoves.push(tile?.position)
            break
        }
        possibleMoves.push(tile?.position)
    }
    return possibleMoves
}

function checkDotMove(piece: number, xDirection: number, yDirection: number): Array<number | undefined>{
    let possibleMoves: Array<number | undefined> = []
    let x = parseInt(piece.toString().slice(1,2)) + xDirection
    let y = parseInt(piece.toString().slice(0,1)) + yDirection
    if(x < 1 || x > 8 || y < 1 || y > 8) return []
    let tile = tiles.getTileInfo(parseInt(`${y}${x}`))
    if(tile?.piece){
        if(tile?.piece.slice(0, 1) === '1' && playerColor === 'white') return []
        if(tile?.piece.slice(0, 1) === '0' && playerColor === 'black') return []
        possibleMoves.push(tile?.position)
        return possibleMoves
    }
    possibleMoves.push(tile?.position)
    return possibleMoves
}


function pawnMoves(tile: TileObj): Array<number | undefined> {
    let possibleMoves: Array<number | undefined> = []
    if(playerColor === 'white'){
        possibleMoves = [
            ...checkPawnMove(tile.position, 0, 1),
            ...checkPawnMove(tile.position, 0, 2),
            ...checkPawnMove(tile.position, 1, 1),
            ...checkPawnMove(tile.position, -1, 1),]}
    if(playerColor === 'black'){
        possibleMoves = [
            ...checkPawnMove(tile.position, 0, -1),
            ...checkPawnMove(tile.position, 0, -2),
            ...checkPawnMove(tile.position, 1, -1),
            ...checkPawnMove(tile.position, -1, -1),]}
    return possibleMoves
}
function checkPawnMove(piece: number, xDirection: number, yDirection: number): Array<number | undefined> {
    let possibleMoves: Array<number | undefined> = []
    if(yDirection === 2 || yDirection === -2) if(parseInt(piece.toString().slice(0,1)) !== 2 && parseInt(piece.toString().slice(0,1)) !== 7) return []
    let x = parseInt(piece.toString().slice(1,2)) + xDirection
    let y = parseInt(piece.toString().slice(0,1)) + yDirection
    if(x < 1 || x > 8 || y < 1 || y > 8) return []
    let tile = tiles.getTileInfo(parseInt(`${y}${x}`))
    if(yDirection === 2 || yDirection === -2) return checkPawnDoubleMove(piece, yDirection)
    if(tile?.piece){
        if(xDirection === 0) return []
        if(tile?.piece.slice(0, 1) === '0' && playerColor === 'black') return []
        if(tile?.piece.slice(0, 1) === '1' && playerColor === 'white') return []
        possibleMoves.push(tile?.position)
        return possibleMoves
    }
    if(xDirection !== 0) return []
    possibleMoves.push(tile?.position)
    return possibleMoves
}
function checkPawnDoubleMove(piece: number, yDirection: number): Array<number | undefined>{
    let x = parseInt(piece.toString().slice(1,2))
    let y = parseInt(piece.toString().slice(0,1)) + (yDirection / 2)
    let tile = tiles.getTileInfo(parseInt(`${y}${x}`))
    if(tile?.piece) return []
    y = y + (yDirection / 2)
    tile = tiles.getTileInfo(parseInt(`${y}${x}`))
    if(tile?.piece) return []
    return [parseInt(`${y}${x}`)]
}

function towerMoves(tile: TileObj): Array<number | undefined> {
    let possibleMoves = [
        ...checkLineMove(tile.position, 1, 0),
        ...checkLineMove(tile.position, 0, 1),
        ...checkLineMove(tile.position, -1, 0),
        ...checkLineMove(tile.position, 0, -1)
    ]
    return possibleMoves
}

function knightMoves(tile: TileObj): Array<number | undefined> {
    let possibleMoves = [
        ...checkDotMove(tile.position, 2, 1),
        ...checkDotMove(tile.position, 2, -1),
        ...checkDotMove(tile.position, -2, 1),
        ...checkDotMove(tile.position, -2, -1),
        ...checkDotMove(tile.position, 1, 2),
        ...checkDotMove(tile.position, -1, 2),
        ...checkDotMove(tile.position, 1, -2),
        ...checkDotMove(tile.position, -1, -2),
    ]
    return possibleMoves
}

function bishopMoves(tile: TileObj): Array<number | undefined> {
    let possibleMoves = [
        ...checkLineMove(tile.position, 1, 1),
        ...checkLineMove(tile.position, 1, -1),
        ...checkLineMove(tile.position, -1, -1),
        ...checkLineMove(tile.position, -1, 1),
    ]
    return possibleMoves
}

function queenMoves(tile: TileObj): Array<number | undefined> {
    let possibleMoves = [
        ...checkLineMove(tile.position, 1, 0),
        ...checkLineMove(tile.position, 0, 1),
        ...checkLineMove(tile.position, -1, 0),
        ...checkLineMove(tile.position, 0, -1),
        ...checkLineMove(tile.position, 1, 1),
        ...checkLineMove(tile.position, 1, -1),
        ...checkLineMove(tile.position, -1, -1),
        ...checkLineMove(tile.position, -1, 1),
    ]
    return possibleMoves
}

function kingMoves(tile: TileObj): Array<number | undefined> {
    let possibleMoves = [
        ...checkDotMove(tile.position, 1, 1),
        ...checkDotMove(tile.position, 1, -1),
        ...checkDotMove(tile.position, -1, 1),
        ...checkDotMove(tile.position, -1, -1),
        ...checkDotMove(tile.position, 1, 0),
        ...checkDotMove(tile.position, 0, 1),
        ...checkDotMove(tile.position, -1, 0),
        ...checkDotMove(tile.position, 0, -1),
        ...canKingCastle(tile)
    ]
    return possibleMoves
}

function canKingCastle(king: TileObj): Array<number | undefined> {
    let pieceColor = king.piece.slice(0, 1) === '0' ? 'black' : 'white'
    if(pieceColor === 'black' && tiles.hasBlackKingMoved) return []
    if(pieceColor === 'white' && tiles.hasWhiteKingMoved) return []
    if(isKingInDanger(tiles.getPositions(), pieceColor, true)) return []
    let leftSide = canKingCastleLeftSide(pieceColor === 'black' ? 8 : 1)
    let rightSide = canKingCastleRightSide(pieceColor === 'black' ? 8 : 1)
    return [...leftSide, ...rightSide]
}
function canKingCastleLeftSide(row: number): Array<number | undefined>{
    let rookPosition = parseInt(`${row}${8}`)
    if(!tiles.getTileInfo(rookPosition)?.piece) return []
    if(tiles.getTileInfo(parseInt(`${row}${5}`))?.piece) return []
    if(tiles.getTileInfo(parseInt(`${row}${6}`))?.piece) return []
    if(tiles.getTileInfo(parseInt(`${row}${7}`))?.piece) return []
    return [parseInt(`${row}8`)]
}
function canKingCastleRightSide(row: number): Array<number | undefined>{
    let rookPosition = parseInt(`${row}${1}`)
    if(!tiles.getTileInfo(rookPosition)?.piece) return []
    if(tiles.getTileInfo(parseInt(`${row}${3}`))?.piece) return []
    if(tiles.getTileInfo(parseInt(`${row}${2}`))?.piece) return []
    return [parseInt(`${row}1`)]
}