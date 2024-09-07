class Geofence {
  constructor(id, name, longitude, latitude) {
	this.id = id;
	this.name = name;
	this.longitude = longitude;
	this.latitude = latitude;
  }

  // Method to get the geofence details
  getDetails() {
	return {
	  id: this.id,
	  name: this.name,
	  longitude: this.longitude,
	  latitude: this.latitude
	};
  }

  // Method to update the geofence location
  updateLocation(longitude, latitude) {
	this.longitude = longitude;
	this.latitude = latitude;
  }

_stream;
}

module.exports = Geofence;