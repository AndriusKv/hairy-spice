angular.module('workspaceApp').factory("chartFactory", function () {
    function generateChart(poll) {
        var ctx = document.getElementById("bar-chart").getContext("2d"),
            pollDetails = {
                options: [],
                votes: []
            },
            data = {};
        
        poll.map(function(pollOption) {
            pollDetails.options.push(pollOption.option);
            pollDetails.votes.push(pollOption.votes);
        });
        
        data = {
            labels: pollDetails.options,
            datasets: [{ data: pollDetails.votes }]
        };
            
        // hack to show chart inside element with ng-show directive.
        setTimeout(function() {
            new Chart(ctx).Bar(data)
        }, 10);
    }
    
    return {
        generateChart: generateChart
    };
});