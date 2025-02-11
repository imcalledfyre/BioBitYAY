var Mode = require('./Mode');

function FFA() {
    Mode.apply(this, Array.prototype.slice.call(arguments));

    this.ID = 0;
    this.name = "vFree For All";
    this.specByLeaderboard = true;
}

module.exports = FFA;
FFA.prototype = new Mode();

// Gamemode Specific Functions

FFA.prototype.onPlayerSpawn = function(gameServer, player) {
    player.color = gameServer.getRandomColor();
    // Spawn player
    gameServer.spawnPlayer(player, gameServer.randomPos());
};

FFA.prototype.updateLB = function(gameServer, lb) {
    gameServer.leaderboardType = this.packetLB;

    for (var i = 0, pos = 0; i < gameServer.clients.length; i++) {
        var player = gameServer.clients[i].playerTracker;
        if (player.isRemoved || !player.cells.length ||
            player.socket.isConnected == false || (!gameServer.config.minionsOnLeaderboard && player.isMi))
            continue;

        for (var j = 0; j < pos; j++)
            if (lb[j]._score < player._score) break;

        lb.splice(j, 0, player);
        pos++;
    }
    this.rankOne = lb[0];
};
