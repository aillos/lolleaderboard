import React, { Component } from "react";

export class Manage extends Component {
    static displayName = Manage.name;



    render() {

        return (
            <div>
                <div className="searchPlayer">
                    <img src={"{`https://ddragon.leagueoflegends.com/cdn/${patchVersion}/img/profileicon/${summoner.summonerIcon}.png`}"} alt={""} />
                    <h2> </h2>
                </div>
                <div className="inputSearch">
                    <input type={"text"} />
                    <div className="button"> Test</div>
                </div>
            </div>
        );
    }
}
