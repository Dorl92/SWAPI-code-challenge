import axios from 'axios';
import { getId } from './utils';

// export const fetchVehicles = (url) => {
//     const vehiclesData = [];
//     const getVehicles = async (url) => {
//         const res = await axios.get(url)
//         const newVehicles = res.data.results.map(vehicle => (
//             {
//                 name: vehicle.name,
//                 pilotIds: vehicle.pilots.map(pilotUrl => getId(pilotUrl))
//             }
//         ))
//         vehiclesData.push(...newVehicles);
//         res.data.next ? getVehicles(res.data.next) : setVehicles(vehiclesData);
//     }
//     getVehicles(url)
// }

export const fetchVehicles = async (url) => {
    const vehiclesData = [];
    let fetchUrl = url;
    while (fetchUrl) {
        const res = await axios.get(fetchUrl)
        const newVehicles = res.data.results.map(vehicle => (
            {
                name: vehicle.name,
                pilotIds: vehicle.pilots.map(pilotUrl => getId(pilotUrl))
            }
        ))
        vehiclesData.push(...newVehicles)
        fetchUrl = res.data.next;
    }
    return vehiclesData;
}

export const fetchPilot = async (pilotId) => {
    const res = await axios.get(`https://swapi.dev/api/people/${pilotId}/`)
    const newPilot = {}
    newPilot[pilotId] = {
        pilotName: res.data.name,
        homePlanet: getId(res.data.homeworld)
    }
    return newPilot;
}

export const fetchPlanets = async (planetsNames, planetsIds) => {
    let planetData = {};
    const tempPlanetsNames = new Set(planetsNames);
    const tempPlanetsIds = new Set(planetsIds);

    let fetchUrl = 'https://swapi.dev/api/planets/';
    while (fetchUrl && (planetsNames.size || planetsIds.size)) {
        const res = await axios.get(fetchUrl)
        res.data.results.map(planet => {
            if (tempPlanetsNames.has(planet.name) || tempPlanetsIds.has(getId(planet.url))) {
                tempPlanetsNames.delete(planet.name)
                tempPlanetsIds.delete(getId(planet.url))

                planetData = {
                    ...planetData,
                    [getId(planet.url)]:
                    {
                        planetName: planet.name,
                        population: planet.population
                    }
                }
            }
        })
        fetchUrl = res.data.next;
        console.log(res.data)
    }
    console.log('after while loop')
    return planetData;
}

