import React from 'react';

const HomelandBars = (props) => {
    const { planets } = props;

    const filteredPlanets = (planets) => {
        const planetsToShow = ['Tatooine', 'Alderaan', 'Naboo', 'Bespin', 'Endor'];
        const filteredPlanets = Object.values(planets).filter(planet => planetsToShow.includes(planet.planetName))
        return filteredPlanets;
    }

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            {planets && filteredPlanets(planets).map(planet => {
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
                                height: `${(((300 - 10) * (planet.population - 200000)) / (4500000000 - 200000)) + 10}px`
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