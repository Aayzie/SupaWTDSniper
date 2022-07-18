_yourName = "AAYZIE";
_targetName = "FORSEN";

_yourName = _yourName.toUpperCase();
_targetName = _targetName.toUpperCase();

client.onStateChange = function(state){
	switch(state){
		case Photon.LoadBalancing.LoadBalancingClient.State.ConnectedToNameServer:
			setTimeout(() => {
				client.connectToRegionMaster("US");
			}, 100);
			break;
		case Photon.LoadBalancing.LoadBalancingClient.State.ConnectedToMaster:
			_connected = true;
            updateName(_yourName);
			break;
		case Photon.LoadBalancing.LoadBalancingClient.State.JoinedLobby:
			_connected = true;
			if(_joinRoomAfterConnect){
				_joinRoomAfterConnect = false;
				joinRoom();
			}
			break;
        case Photon.LoadBalancing.LoadBalancingClient.State.Joined:
            checkIfTargetInRoom();
            break;
		case Photon.LoadBalancing.LoadBalancingClient.State.Disconnected:
			if(_connected){
				_checkReconnectOnVisible = document.visibilityState !== 'visible';
				if(_checkReconnectOnVisible)
					return;
				setAlert('Lost connection to server');
				_connected = false;
			}
			_checkReconnectOnVisible = false;
			_joinRoomAfterConnect = false;
			initDisplay();
			setTimeout(() => {
				client.connectToNameServer();
			}, 100);
			break;
	}
};

const checkIfTargetInRoom = function(){
    for (const property in client.actors) {
        if(client.actors[property].name == _targetName){
            console.log(_targetName + " FOUND! GO TO https://www.youtube.com/c/ForsensGiftboxTV FOR MORE INFO");
            return;
        }
    }
    setTimeout(() => {
        console.log(_targetName + " NOT FOUND! DISCONNECTING.");
        client.disconnect();
        _connected = false;
    }, 100);
}

client.onRoomListUpdate = function(rooms, roomsUpdated, roomsAdded, roomsRemoved){
    for (room of roomsUpdated){
        if(roomsUpdated[0].playerCount >= 2){
            client.joinRoom(roomsUpdated[0].name);
        }
    }
}

client.connectToNameServer();