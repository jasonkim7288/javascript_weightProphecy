export function sortWeightHistory(user){
    user.weightHistory.sort(function (a, b) {
        if (a.date > b.date) return 1;
        if (a.date< b.date) return -1;
        return 0;
    });
}

export function sortNames(data){
    data.sort(function (a, b) {
        if (a.name > b.name) return 1;
        if (a.name< b.name) return -1;
        return 0;
    });
}