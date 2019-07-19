// React
import React, { Component } from 'react';
import classNames from 'classnames';
import shortid from 'shortid';
// Components
import Button from '../button/button';
import Spinner from '../spinner/spinner';
import * as gameLogic from '../../libs/diceGameLogic';
// Styles
import './diceGame.scss';

const WELCOME_MESSAGE = 'Welcome to Dice Poker Game!';
const SELECT_PLAYERS_MESSAGE = 'Inform the number of players';
const MATCH_MESSAGE = `Player's Match`;
const WINNER_MESSAGE = 'Winner';
const NEW_GAME_BUTTON_TEXT = 'New Game';
const START_GAME_BUTTON_TEXT = 'Start';
const PLAY_AGAIN_BUTTON_TEXT = 'Play Again';
const FINISH_MATCH_BUTTON_TEXT = 'End Match';
const MIN_PLAYERS_NUMBER = 2;
const MAX_PLAYERS_NUMBER = 5;
const DEFAULT_PLAYERS_SELECTOR = 'DEFAULT';

const GAME_PHASES = {
    NotStarted: 1,
    PlayerSelection: 2,
    Started: 3,
};

class DiceGame extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gamePhase: GAME_PHASES.NotStarted,
            numberOfPlayers: DEFAULT_PLAYERS_SELECTOR,
        };

        this.onPlayAgainClicked = this.onPlayAgainClicked.bind(this);
        this.onPlayersNumberChanged = this.onPlayersNumberChanged.bind(this);
        this.onRestart = this.onRestart.bind(this);
        this.onStartGame = this.onStartGame.bind(this);
        this.onSelectPlayers = this.onSelectPlayers.bind(this);
    }

    onPlayAgainClicked() {
        this.forceUpdate();
    }

    onPlayersNumberChanged(event) {
        if (event && event.target && !isNaN(event.target.value)) {
            this.setState({
                numberOfPlayers: Number(event.target.value),
            });
        }
    }

    onRestart() {
        this.setState({
            gamePhase: GAME_PHASES.NotStarted,
            numberOfPlayers: null,
        });
    }

    onStartGame() {
        this.setState((prevState) => {
            const { numberOfPlayers } = prevState;

            if (!isNaN(numberOfPlayers) && numberOfPlayers >= 2) {
                return {
                    gamePhase: GAME_PHASES.Started,
                }
            }
        });
    }

    onSelectPlayers() {
        this.setState({
            gamePhase: GAME_PHASES.PlayerSelection,
        });
    }

    /* render home screen */
    renderLandingPage() {
        return (
            <div className="diceGameBody unselectableText">
                <div className="bodyContent bordered shadowed row">
                    <div className="column">
                        <div className="spinnerRow row">
                            <div className="spinnerColumn column">
                                <Spinner />
                            </div>
                        </div>
                        <div className="row">
                            <div className="column">
                                <div className="bodyMessage">{WELCOME_MESSAGE}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="diceGameControls row">
                    <Button text={NEW_GAME_BUTTON_TEXT} isPrimary={true} onClick={this.onSelectPlayers} />
                </div>
            </div>
        );
    }

    /* render player selection phase */
    renderPlayerSelection() {
        const { numberOfPlayers } = this.state;
        const options = [];

        for (let index = MIN_PLAYERS_NUMBER; index < MAX_PLAYERS_NUMBER + 1; index++) {
            options.push(
                <option
                    value={index}
                    key={`option-${shortid.generate()}`}>
                    {index} Players
                    </option>);
        }

        return (
            <div className="diceGameBody unselectableText">
                <div className="bodyContent bordered shadowed playerSelection">
                    <div className="row">
                        <div className="column">
                            <div className="bodyMessage">{SELECT_PLAYERS_MESSAGE}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="playerSelectionInput column">
                            <select id="player" 
                                value={numberOfPlayers}
                                onChange={this.onPlayersNumberChanged}>
                                <option value={DEFAULT_PLAYERS_SELECTOR}>Select</option>
                                {options}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="diceGameControls row">
                    <Button text={START_GAME_BUTTON_TEXT} isPrimary={true} onClick={this.onStartGame} />
                </div>
            </div>
        );
    }

    /* renders each player dices HTML */
    renderPlayerList(numberOfPlayers) {
        const players = [];
        const playerList = [];

        for (let i = 0; i < numberOfPlayers; i++) {
            playerList.push(gameLogic.getPlayer());
        }

        const winnerPoints = Math.max(...playerList.map(player => player.info.points), 0);

        playerList.forEach((playerItem, index) => {
            let header = `Player: ${index}`;
            let isWinner = false;

            if (playerItem.info.points === winnerPoints) {
                header = WINNER_MESSAGE;
                isWinner = true;
            }

            const playerDices = [];
            playerItem.dices.forEach(dice => {
                playerDices.push(<div className="dice column bordered shadowed" key={`div-${shortid.generate()}`}>{dice.text}</div>);
            });

            players.push(
                <div
                    className="player bordered shadowed column"
                    key={`div-${shortid.generate()}`}>
                    <div className={classNames({
                        playerName: true,
                        winner: isWinner,
                        masterVictory: playerItem.info.masterVictory,
                    })}>{header}</div>
                    <div className="playerDices row">
                        {playerDices}
                    </div>
                    <div className="playerHand bordered">{playerItem.info.message}</div>
                </div>);
        });

        return players;
    }

    /* render game phase */
    renderGame() {
        const { numberOfPlayers } = this.state;
        const players = this.renderPlayerList(numberOfPlayers);

        return (
            <div className="diceGameBody unselectableText">
                <div className="bodyContent bordered shadowed row">
                    <div className="column">
                        <div className="row">
                            <div className="column">
                                <div className="bodyMessage">{numberOfPlayers} {MATCH_MESSAGE}</div>
                            </div>
                        </div>
                        <div className="playersGame row">
                            {players}
                        </div>
                    </div>
                </div>
                <div className="diceGameControls row">
                    <Button text={PLAY_AGAIN_BUTTON_TEXT} isPrimary={true} onClick={this.onPlayAgainClicked} />
                    <Button text={FINISH_MATCH_BUTTON_TEXT} isPrimary={true} onClick={this.onRestart} />
                </div>
            </div>
        );
    }

    /* render phases */
    renderPhase() {
        const { gamePhase } = this.state;

        switch (gamePhase) {
            case GAME_PHASES.NotStarted:
                return this.renderLandingPage();
            case GAME_PHASES.PlayerSelection:
                return this.renderPlayerSelection();
            case GAME_PHASES.Started:
                return this.renderGame();
            default:
                break;
        }
    }

    /* render component */
    render() {
        return (
            <div className="diceGame">
                {this.renderPhase()}
            </div>
        );
    }
}

export default DiceGame;
