import React, { Component } from "react";
import axios from "axios";
import Card from 'react-bootstrap/Card';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            patchVersion: null,
            patchVersionText: '',
            summoners: [],
            loading: true
        };
        this.winrate = this.winrate.bind(this);
    }

    async populateSummoners() {
        try {
            const response = await axios.get('api/getAll');

            this.setState({ summoners: response.data, loading: false });
        } catch (error) {
            console.error("Error fetching summoners:", error);
        }
    }

    async getPatchVersion() {
        try {
            const response = await axios.get('https://ddragon.leagueoflegends.com/realms/euw.json');
            let patchVersion = response.data.v;
            const patchNumber = patchVersion.charAt(patchVersion.length-1);
            let bPatch = '';
            if (parseInt(patchNumber) !== 1) bPatch = 'B';
            const patchVersionText = patchVersion.replace(/\.\d+$/, '') + bPatch;

            this.setState({ patchVersion, patchVersionText });
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    winrate(wins, losses){
        if(wins+losses === 0) return '0%';
        return `${((wins / (wins + losses)) * 100).toFixed(2)}%`;
    }

    static renderSummoner(summoners, winrate, patchVersion) {
        return (
            <div>
                {summoners.map((summoner, index) => (
                    <Card className="playerCard" key={summoner.gameName+summoner.tagLine}>
                        <Card.Body>
                            <div className="summonerIcon">
                                <img src={`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/${summoner.summonerIcon}.png`} alt="" />
                            </div>
                            <Card.Title>{index+1}. {summoner.gameName}</Card.Title>
                            <Card.Text>
                                <p>Rank: {summoner.tier} {summoner.rank} {summoner.lp}</p>
                                <p>Wins: {summoner.wins}</p>
                                <p>Losses: {summoner.losses}</p>
                                <p>Winrate: {winrate(summoner.wins, summoner.losses)}</p>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        );
    }

    componentDidMount() {
        this.populateSummoners();
        this.getPatchVersion()
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Home.renderSummoner(this.state.summoners, this.winrate, this.state.patchVersion);

        return (
            <div>
                Patch {this.state.patchVersionText}
                {contents}
            </div>
        );
    }
}
