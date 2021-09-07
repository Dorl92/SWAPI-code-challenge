import React from 'react';

const HomelandBars = (props) => {

    const { planets, planetsToShow } = props;

    const filteredPlanets = (planets, planetsToShow) => {
        return Object.values(planets).filter(planet => planetsToShow.has(planet.planetName))
    }

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            {planets && filteredPlanets(planets, planetsToShow).map(planet => {
                return (
                    <div key={planet.planetName} style={
                        {
                            display: "flex",
                            alignItems: "center",
                            flexDirection: "column",
                            margin: "auto 1rem 0 1rem"
                        }
                    }>
                        <h4>{planet.population}</h4>
                        <div style={
                            {
                                border: "1px solid black",
                                backgroundColor: "lightgray",
                                width: "70px",
                                height: `${(((350 - 5) * (planet.population - 200000)) / (4500000000 - 200000)) + 5}px`
                            }
                        }></div>
                        <h4>{planet.planetName}</h4>
                    </div>
                )
            })
            }
        </div>
    );
};

export default HomelandBars;