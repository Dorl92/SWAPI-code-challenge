export const getId = (url) => {
    const temp = url.slice(0, url.length - 1)
    const lastIndex = temp.lastIndexOf('/')
    return temp.slice(lastIndex + 1)
}

export const uniquePilots = (vehicles) => {
    const uniquePilotsIds = new Set();
    vehicles.forEach(vehicle => {
        vehicle.pilotIds.forEach(pilotId => {
            uniquePilotsIds.add(pilotId);
        })
    })
    return uniquePilotsIds;
}

export const maxPopulation = (vehicles, planets, pilots) => {
    let maxPopulation = 0;
    let vehicleMaxPopulation;
    vehicles.forEach(vehicle => {
        const vehiclePopulation = vehicle.pilotIds.reduce((accumulator, currentValue) => {
            const population = planets[pilots[currentValue].homePlanet].population;
            return (population !== 'unknown') ? accumulator + +population : accumulator;
        }, 0)
        if (vehiclePopulation > maxPopulation) {
            maxPopulation = vehiclePopulation;
            vehicleMaxPopulation = vehicle;
        }
    })
    return {
        vehicle: vehicleMaxPopulation.name,
        planets: vehicleMaxPopulation.pilotIds.map(pilotId => planets[pilots[pilotId].homePlanet]),
        pilots: vehicleMaxPopulation.pilotIds.map(pilotId => pilots[pilotId].pilotName),
    }
}