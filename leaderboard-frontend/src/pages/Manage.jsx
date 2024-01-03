import React, { Component } from "react";

export class Manage extends Component {
    static displayName = Manage.name;



    render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : Manage.renderSummoner(this.state.summoners, this.winrate, this.state.patchVersion);

        return (
            <div>
                <div className="searchPlayer">
                    <img src={""} alt={""} />
                    <h2> </h2>
                </div>
                <div className="inputSearch">
                    <input type={"text"} />
                </div>
                {contents}
            </div>
        );
    }
}
