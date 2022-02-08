"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function default_1(vaccinations) {
    let nextVaccination;
    let nowDate = new Date();
    let dates = vaccinations.map(x => x.date).join(",").split(",");
    dates.forEach((vacination) => {
        let vacinationDate = new Date(String(vacination));
        if (!nextVaccination) {
            nextVaccination = vacinationDate;
        }
        else if (vacinationDate < nextVaccination && vacinationDate > nowDate) {
            nextVaccination = vacinationDate;
        }
    });
    return nextVaccination;
}
exports.default = default_1;
