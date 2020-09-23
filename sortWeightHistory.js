export default function sortWeightHistory(user){
    user.weightHistory.sort(function (a, b) {
        if (a.date > b.date) return 1;
        if (a.date< b.date) return -1;
        return 0;
    });
}