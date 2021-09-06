import React, { useState, useEffect, Fragment } from 'react';
import { fetchVehicles, fetchPilot, fetchPlanets } from './fetch';
import { uniquePilots, maxPopulation } from './utils';
import HomelandBars from './HomelandBars';

const StarWarsNew = () => {

    const [vehicles, setVehicles] = useState();
    const [pilots, setPilots] = useState();
    const [planets, setPlanets] = useState();
    const [uniquePlanets, setUniquePlanets] = useState();

    const [result, setResult] = useState();

    const planetsNames = new Set(['Tatooine', 'Alderaan', 'Naboo', 'Bespin', 'Endor']);

    useEffect(() => {
        fetchVehicles('https://swapi.dev/api/vehicles/')
            .then(res => setVehicles(res))
    }, [])

    useEffect(() => {
        if (vehicles) {
            let uniquePlanetsIds = new Set();
            const uniquePilotsIds = uniquePilots(vehicles);
            Promise.all(Array.from(uniquePilotsIds).map(pilotId => fetchPilot(pilotId)))
                .then(res => {
                    if (res.length) {
                        let pilotsData = {};
                        res.forEach(pilot => {
                            uniquePlanetsIds.add(Object.values(pilot)[0].homePlanet)
                            pilotsData = { ...pilotsData, ...pilot }
                        })
                        setUniquePlanets(uniquePlanetsIds)
                        setPilots(pilotsData)
                    }
                })
                .catch(err => console.log(err))
        }
    }, [vehicles])

    useEffect(() => {
        if (uniquePlanets) {
            fetchPlanets(planetsNames, uniquePlanets)
                .then(res => setPlanets(res))
        }
    }, [uniquePlanets])

    useEffect(() => {
        if (planets) {
            const result = maxPopulation(vehicles, planets, pilots)
            setResult(result)
        }
    }, [planets])

    return (
        <div>
            <h1>Star Wars API</h1>
            {result ?
                <Fragment>
                    <table style={{ textAlign: "left", margin: "0 auto" }}>
                        <tbody>
                            <tr>
                                <th>Vehicle name with the largest sum</th>
                                <th>{result.vehicle}</th>
                            </tr>
                            <tr>
                                <th>Related home planets and their respective population</th>
                                <th>{result.planets.map(planet => `[${planet.planetName}, ${planet.population}] `)}</th>
                            </tr>
                            <tr>
                                <th>Related pilot names</th>
                                <th>{result.pilots.map(pilot => `[${pilot}] `)}</th>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        <HomelandBars planets={planets} />
                    </div>
                </Fragment>
                : <h4>Loading...</h4>
            }
        </div>
    );
};

export default StarWarsNew;