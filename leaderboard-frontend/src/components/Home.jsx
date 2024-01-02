import React, { Component } from "react";
import axios from "axios";
import Card from 'react-bootstrap/Card';

export class Home extends Component {
    static displayName = Home.name;

    constructor(props) {
        super(props);
        this.state = {
            summoners: [], // Updated to summoners
            loading: true
        };
    }

    async populateSummoners() {
        try {
            const response = await axios.get('api/getAll'); // Ensure the API endpoint is correct

            this.setState({ summoners: response.data, loading: false });
        } catch (error) {
            console.error("Error fetching summoners:", error);
            // Additional error handling can be implemented here
        }
    }

    static renderSummoner(summoners) {
        return (
            <div>
                {summoners.map(summoner => (
                    <Card key={summoner.puuid}>
                        <Card.Body>
                            <Card.Title>{summoner.name}</Card.Title>
                            <Card.Text>
                                Tier: {summoner.tier}<br/>
                                Rank: {summoner.rank}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        );
    }

    componentDidMount() {
        this.populateSummoners();
    }

    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Home.renderSummoner(this.state.summoners);

        return (
            <div>
                {contents}
            </div>
        );
    }
}
