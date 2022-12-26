import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// class Square extends React.Component {
function Square(props) {
    // constructor(props){
    //     super(props);
    //     this.state = {
    //         value: null,
    //     };
    // }

    // render() {
    return (
        <button className="square" style={{'backgroundColor': props.winnerSpots ? '#7FFF00' : 'white' , ...{'color': props.winnerSpots ? 'red' : 'black'}}} onClick={
            // ()=> {
            // this.setState({value: 'X'})
            // props.onClick({value: 'X'})
            props.onClick
            // console.log("click")
            // }
        }>
            {/* {this.state.value} */}
            {props.value}
        </button>
    );
    // }
}

class Board extends React.Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         squares: Array(9).fill(null),
    //         xIsNext: true,
    //     };
    // }

    // handleClick(i) {
    //     const squares = this.state.squares.slice();
    //     if(squares[i] || calculateWinner(squares)){
    //         return;
    //     }
    //     squares[i] = this.state.xIsNext ? 'X' : 'O';
    //     this.setState({
    //         squares: squares,
    //         xIsNext: !this.state.xIsNext,
    //     })
    // }

    renderSquare(i) {
        // return <Square />;
        return (
            <Square
                // value={this.state.squares[i]}
                // onClick={() => { this.handleClick(i) }}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i) }
                winnerSpots={this.props.winnerSpots[i]}
            />
        );
    }

    render() {
        // const status = this.state.xIsNext ? 'X' : 'O';

        // const winner = calculateWinner(this.state.squares);
        // let status;
        // if (winner) {
        //     status = 'Winner: ' + winner;
        // } else {
        //     status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        // }
        

        return (
            <div>
                {/* <div className="status">{status}</div> */}
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}




class Game extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                position: null,
                winnerSpots: Array(9).fill(false),
                isDraw: false,
            }],
            xIsNext: true,
            stepNumber: 0,
        };
    }


    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const winnerSpots = current.winnerSpots.slice();
        let isDraw = false;
        if(squares[i] || calculateWinner(squares)){
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        if(calculateWinner(squares)){
            const won = calculateWinner(squares)
            for(let j=0;j<3;j++){
                winnerSpots[won[1][j]] = true;
            }
        }
        if(checkforDraw(squares) && (calculateWinner(squares) ? false : true)){
            isDraw = true;
        }
        this.setState({
            history: history.concat([{
                squares: squares,
                position: i,
                winnerSpots: winnerSpots,
                isDraw: isDraw,
            }]),           
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        });
    }


    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step%2) === 0,
        });
    }


    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? 'Go To Move #' + move : 'Go To Game Start';
            return(
                    <li key={move} style={{'fontWeight': this.state.stepNumber === move ? 'bold' : 'normal'}}>
                        <button style={{'fontWeight': this.state.stepNumber === move ? 'bold' : 'normal'}} onClick={()=>this.jumpTo(move)}>{desc}</button>
                    </li>
            );
        });    

        const position = history.map((step, move) => {
            const desc = move ? "(" + Math.floor(this.state.history[move]["position"]/3) + ", " + this.state.history[move]["position"]%3 + ")" : 'Game Start';
            return(
                <li key={move} style={{'fontWeight': this.state.stepNumber === move ? 'bold' : 'normal'}}>
                    <button style={{'fontWeight': this.state.stepNumber === move ? 'bold' : 'normal'}}>{desc}</button>
                </li>
            );
        }); 


        let status;
        if (winner) {
            status = 'Winner: ' + winner[0];
        } 
        else if(current.isDraw){
            status = 'Draw'
        }
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}    
                        winnerSpots={current.winnerSpots}    
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
                <div className="game-info">
                    <div>Position:</div>
                    <ol>{position}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);







function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a], lines[i]];
        }
    }
    return null;
}



function checkforDraw(squares){
    console.log(squares);
    for(let i=0;i<squares.length;i++){
        if(squares[i]==null){
            console.log("34r5");
            return false;
        }
    }
    return true;
} 