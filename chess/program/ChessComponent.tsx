import React from 'react';
import './style.css'
import { useEffect } from 'react'
import { tileClick, tiles, whoseTurn, autoMove, setWhoseTurn } from './gamelogic'
import { ImagePieces as imageCodes } from './piecesImages'

interface TileObj {
    position: number,
    piece: string | any,
    color: string
}

interface actionMoveInfoObj {
    action: string,
    move: string | null
}

interface actionInfoObj {
    action: string,
    info: string | null | actionMoveInfoObj | object
}
//If you are playing both colors on the same device set this to true it will change the player color every time a move is made
export let isLocalGame = false

export let playerColor = 'white'
//setPlayerColor is only used once in gamelogic.ts at lines 254 and 256 to make the MoveFinder be able to check if a move results in a checkmate or not
//I know its not the optimal way but its not that big of a deal so I never bothered to fix it
export function setPlayerColor(color: string) {playerColor = color}

export function artificialMove(from: number, to: number){
    let clickResult: actionInfoObj = autoMove(from, to)
    clickResult.action === 'move' && handlePlayerMove(clickResult.info)
    renderPieces(tiles.getPositions())
}



//OUTCOME STRING: [move piece] + [move '>' or eat '<'] + [eaten piece (move piece if no piece was there)] + [result ('' for nothing, '*' for check, 'x' for checkmate)] + [move positions (from, to)]
//Ex. eat: '021<1053455', check: '021>021*4263', check after eating a piece: '030<103*8347', normal move: '021>0211736', castling: '050:0118481', checkmate '010>010x3353'

//Called every time a move is made, receives an outcome string as a param
function handleMove(move: string){
    console.log('MOVE:', move)
}
//Called every time the king gets attacked, receives an outcome string as a param
function handleKingAttack(move: string){
    console.log('CHECK:', move)
}
//Called every time there is a checkmate, receives an outcome string as a param
function handleCheckmate(move: string){
    console.log('CHECKMATE:', move)
}
//Called every time a piece is eaten, receives an outcome string as a param
function handleAttack(move: string){
    console.log('PIECE EATEN:', move)
}
//Called every time a king castles, receives an outcome string as a param
function handleCastling(move: string){
    console.log('KING HAS CASTLED:', move)
}

//Called every time you click on an empty tile
function handleEmptyTileClick(tilePosition: number){
    console.log('EMPTY CLICK:', tilePosition)
}
//Called every time you click on your opponents tile
function handleWrongTileClick(tilePosition: number){
    console.log('WRONG PIECE:', tilePosition)
}
//Called every time you click on your opponents turn
function handleNotYourTurnClick(tilePosition: number){
    console.log('WRONG TURN CLICK:', tilePosition)
    alert('Wait for your turn.')
}
//Called every time you select or move your piece, receives result of your click (move, check, select, unselect)
function onPlayerMove(clickResult: actionInfoObj){
    console.log('ANY MOVE:', clickResult)
}

const Chess: React.FC<any> = () => {

    useEffect(() => {
        createBoard()
        renderPieces(tiles.getPositions())
    }, [])

    function createBoard(){
        const board = document.getElementById('chessboard')
        if((board as any).children.length > 55) return
        let isWhite = false
        for(let i = 0;i < 8;){
            i++
            isWhite ? isWhite = false : isWhite = true
            for(let j = 0;j < 8;){
                j++
                isWhite ? isWhite = false : isWhite = true
                let tile = formatTileObj(i, j, isWhite)
                board?.appendChild(tile.div)
            }
        }
    }

    function formatTileObj(i: number, j: number, clr: boolean){
        let tile = {
            div: document.createElement('div'),
            number: i,
            letter: j,
            color: clr ? 'white' : 'black',
        }
        tile.div.addEventListener('click', () => tileOnClick(i, j))
        tile.div.classList.add(`board-tile`)
        tile.div.classList.add(clr ? 'bt-white' : 'bt-black')
        tile.div.id = `tile-${i}${j}`
        return tile
    }

    return (  
    <div className="chess-root">
        <div id='chessboard'>

        </div>
    </div>
    );
}
export default Chess;



let isPieceSelected = false

function renderPieces(positions: Array<TileObj>){
    positions.forEach((e, i) => {
        const tile = document.getElementById(`tile-${e.position.toString()}`)
        let index = 0
        while(tile?.hasChildNodes()) {
            tile.removeChild(tile.children[index])
            index++
        }
        if(e.piece){
            let img = document.createElement('img')
            img.classList.add('piece-image')
            img.src = imageCodes.get(e.piece.slice(0,2)) || ''
            tile?.appendChild(img)
        }
    })
}


function tileOnClick(number: number, letter: number){
    let canTileMove = canMove(number, letter)
    if(canTileMove === 'empty') return handleEmptyTileClick(parseInt(`${number}${letter}`))
    if(canTileMove === 'not your piece') return handleWrongTileClick(parseInt(`${number}${letter}`))
    if(canTileMove === 'not your turn') return handleNotYourTurnClick(parseInt(`${number}${letter}`))
    let clickResult: actionInfoObj  = tileClick(number, letter)
    onPlayerMove(clickResult)
    clickResult.action === 'illegal' && handleIllegalMove(clickResult.info)
    clickResult.action === 'move' && handlePlayerMove(clickResult.info)
    clickResult.action === 'select' && handlePlayerSelect(clickResult.info)
}

function canMove(number: number, letter: number): boolean | string{
    if(isPieceSelected) return true
    let pieceClr = tiles.getTileInfo(parseInt(`${number}${letter}`))?.piece
    if(!pieceClr) return 'empty'
    pieceClr = pieceClr.slice(0, 1)
    if(playerColor === 'white' && pieceClr === '0') return 'not your piece'
    if(playerColor === 'black' && pieceClr === '1') return 'not your piece'
    if(playerColor !== whoseTurn) return 'not your turn'
    return true
}

//this function runs every time you try to make an illegal move
function handleIllegalMove(issue: string | actionMoveInfoObj | null | object){
    
}

function handlePlayerMove(move: string | actionMoveInfoObj | null | object){
    isPieceSelected = false
    if((move as any).moveAction === 'unselect') {
        if(whoseTurn === 'white') setWhoseTurn('black')
        else setWhoseTurn('white') 
    }
    if((move as any).move.includes('*')) handleKingAttack((move as any).move)
    if((move as any).move.includes('x')) handleCheckmate((move as any).move)
    if((move as any).move.includes('<')) handleAttack((move as any).move)
    if((move as any).move.includes(':')) handleCastling((move as any).move)
    handleMove((move as any).move)
    renderPieces(tiles.getPositions())
}

function handlePlayerSelect(selected: string | object | null | actionMoveInfoObj){
    isPieceSelected = true
}
