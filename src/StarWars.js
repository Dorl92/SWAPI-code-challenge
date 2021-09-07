import React, { useState, useEffect, useMemo, Fragment } from 'react';
import { fetchVehicles, fetchPilot, fetchPlanets } from './fetch';
import { uniquePilots, extractHomePlanetId } from './utils';
import HomelandBars from './HomelandBars';
import { VEHICLES_URL } from './urls';

const StarWarsNew = () => {

    const [vehicles, setVehicles] = useState();
    const [pilots, setPilots] = useState();
    const [planets, setPlanets] = useState();
    const [uniquePlanetsIds, setUniquePlanetsIds] = useState();

    const planetsNames = new Set(['Tatooine', 'Alderaan', 'Naboo', 'Bespin', 'Endor']);

    useEffect(() => {
        fetchVehicles(VEHICLES_URL)
            .then(res => setVehicles(res))
            .catch(err => console.log('Error in FecthVehicle', err))
    }, [])

    useEffect(() => {
        if (vehicles) {
            fetchPilots()
        }
    }, [vehicles])

    useEffect(() => {
        if (uniquePlanetsIds) {
            fetchPlanets(planetsNames, uniquePlanetsIds)
                .then(res => setPlanets(res))
                .catch(err => console.log('Error in FecthPlanets', err))
        }
    }, [uniquePlanetsIds])


    const fetchPilots = () => {
        if (vehicles) {
            let uniquePlanetsIds = new Set();
            const uniquePilotsIds = uniquePilots(vehicles);
            Promise.all(Array.from(uniquePilotsIds).map(pilotId => fetchPilot(pilotId)))
                .then(res => {
                    if (res.length) {
                        let pilotsData = {};
                        res.forEach(pilot => {
                            const homePlantId = extractHomePlanetId(pilot)
                            uniquePlanetsIds.add(homePlantId)
                            pilotsData = { ...pilotsData, ...pilot }
                        })
                        setUniquePlanetsIds(uniquePlanetsIds)
                        setPilots(pilotsData)
                    }
                })
                .catch(err => console.log('Error in FecthPilots', err))
        }
    }

    const getMaxVechilePopulation = useMemo(() => {
        if (planets) {
            let maxPopulation = 0;
            let vehicleMaxPopulation = [];
            vehicles.forEach(vehicle => {
                const vehiclePopulation = vehicle.pilotIds.reduce((accumulator, currentValue) => {
                    const population = planets[pilots[currentValue].homePlanet].population;
                    return (population !== 'unknown') ? accumulator + +population : accumulator;
                }, 0)
                if (vehiclePopulation > maxPopulation) {
                    maxPopulation = vehiclePopulation;
                    vehicleMaxPopulation = [vehicle];
                } else if (vehiclePopulation === maxPopulation) {
                    vehicleMaxPopulation.push(vehicle);
                }
            })
            return vehicleMaxPopulation.map(vehicle =>
            ({
                vehicleName: vehicle.name,
                planets: vehicle.pilotIds.map(pilotId => planets[pilots[pilotId].homePlanet]),
                pilots: vehicle.pilotIds.map(pilotId => pilots[pilotId].pilotName),
            }
            ))
        }
    }, [vehicles, pilots, planets])

    const showPlanetsNames = (getMaxVechilePopulation) => {
        return getMaxVechilePopulation.map(vehicle => vehicle.planets.map(planet => `[${planet.planetName}, ${planet.population}] `))
    }

    const showPilotsNames = (getMaxVechilePopulation) => {
        return getMaxVechilePopulation.map(vehicle => vehicle.pilots.map(pilot => `[${pilot}] `))
    }

    return (
        <div>
            <h1>Star Wars API</h1>
            {getMaxVechilePopulation ?
                <Fragment>
                    <table style={{ textAlign: "left", margin: "0 auto" }}>
                        <tbody>
                            <tr>
                                <th>Vehicle name with the largest sum</th>
                                <th>{getMaxVechilePopulation.map(vehicle => vehicle.vehicleName)}</th>
                            </tr>
                            <tr>
                                <th>Related home planets and their respective population</th>
                                <th>
                                    {showPlanetsNames(getMaxVechilePopulation)}
                                </th>
                            </tr>
                            <tr>
                                <th>Related pilot names</th>
                                <th>
                                    {showPilotsNames(getMaxVechilePopulation)}
                                </th>
                            </tr>
                        </tbody>
                    </table>
                    <div>
                        <HomelandBars planets={planets} planetsToShow={planetsNames} />
                    </div>
                </Fragment>
                : <h4>Loading...</h4>
            }
        </div>
    );
};

export default StarWarsNew;