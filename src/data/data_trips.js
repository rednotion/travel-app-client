export const trips = {
	'j1': {
		'tripId': 'j1',
		'tripName': 'Solo in Japan', 
		'tripStart': '12/10/2019', 
		'tripEnd': '20/10/2019',
		'tripLocation': 'Japan'},
}

export const info = {
	"items": {
		'place-1': {id: 'place-1', type: 'location', description: 'Grand Canyon', duration: 2},
  		'place-2': {id: 'place-2', type: 'location', description: 'Lake Tahoe', duration: 4},
  		'place-3': {id: 'place-3', type: 'location', description: 'San Francisco', duration: 2},
  		'place-4': {id: 'place-4', type: 'location', description: 'Pacific Coast Highway', duration: 2},
  		'place-5': {id: 'place-5', type: 'location', description: 'Las Vegas', duration: 1.5},
  		'place-6': {id: 'place-6', type: 'location', description: 'Sequoia National Park', duration: 3},
  		'place-7': {id: 'place-7', type: 'location', description: 'Yosemite', duration: 1}
  	},

  	"columns": {
  		'col-1': {id: 'col-1', type: 'day', description: 'Day 1', taskIds: ['place-1']},
  		'col-2': {id: 'col-2', type: 'day', description: 'Day 2', taskIds: ['place-2']},
  		'col-3': {id: 'col-3', type: 'day', description: 'Day 3', taskIds: ['place-3']},
  		'wishlist-1': {
			id: 'wishlist-1', 
			type: 'wishlist',
			description: 'My Wishlist', 
			taskIds: ['place-4', 'place-5', 'place-6', 'place-7',]
		}
  	},

  	"colOrder": ['col-1', 'col-2', 'col-3'],
  	"wishlistColOrder": ['wishlist-1']
}

export const distances = {
	'place-1': {
		'place-1': 0,
		'place-2': 1,
		'place-3': 1.5,
		'place-4': 3,
		'place-5': 1,
		'place-6': 1.5,
		'place-7': 3,
	},
	'place-2': {
		'place-1': 1,
		'place-2': 0,
		'place-3': 4,
		'place-4': 0.5,
		'place-5': 1,
		'place-6': 1.5,
		'place-7': 3,
	},
	'place-3': {
		'place-1': 1.5,
		'place-2': 4,
		'place-3': 0,
		'place-4': 1,
		'place-5': 1,
		'place-6': 1.5,
		'place-7': 3,
	},
	'place-4': {
		'place-1': 1,
		'place-2': 0,
		'place-3': 4,
		'place-4': 0.5,
		'place-5': 1,
		'place-6': 1.5,
		'place-7': 3,
	},
	'place-5': {
		'place-1': 1,
		'place-2': 0,
		'place-3': 4,
		'place-4': 0.5,
		'place-5': 1,
		'place-6': 1.5,
		'place-7': 3,
	},
	'place-6': {
		'place-1': 1,
		'place-2': 0,
		'place-3': 4,
		'place-4': 0.5,
		'place-5': 1,
		'place-6': 1.5,
		'place-7': 3,
	},
	'place-7': {
		'place-1': 1,
		'place-2': 0,
		'place-3': 4,
		'place-4': 0.5,
		'place-5': 1,
		'place-6': 1.5,
		'place-7': 3,
	}
}