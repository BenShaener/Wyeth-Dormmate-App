import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Map, Users, Calendar, ShoppingBag, Menu, X, Plus, Check} from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const App = () => {
  const [activeTab, setActiveTab] = useState('roommates');
  const [userProfile, setUserProfile] = useState({
    id: 'currentUserId',
    name: 'Your Name',
    major: 'Your Major',
    year: 'Your Year',
    interests: [],
    profilePicture: '/api/placeholder/100/100',
    isMatched: false
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [events, setEvents] = useState([]);

  const renderContent = () => {
    switch (activeTab) {
      case 'roommates':
        return <RoommatesScreen userProfile={userProfile} setUserProfile={setUserProfile} />;
      case 'events':
        return <EventsScreen userProfile={userProfile} events={events} setEvents={setEvents} />;
      case 'map':
        return <MapScreen events={events} />;
      case 'market':
        return <MarketScreen />;
      case 'more':
        return <MoreScreen />;
      default:
        return <RoommatesScreen userProfile={userProfile} setUserProfile={setUserProfile} />;
    }
  };

  return (
    <div className="flex justify-center bg-gray-100 min-h-screen">
      <div className="w-full max-w-md bg-white flex flex-col h-screen">
        <header className="bg-blue-600 p-4 flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">Newbie</h1>
          <button onClick={() => setIsEditingProfile(true)} className="w-10 h-10 rounded-full overflow-hidden">
            <img src={userProfile.profilePicture} alt="Profile" className="w-full h-full object-cover" />
          </button>
        </header>
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
        <nav className="bg-blue-600 h-16 shadow-lg">
          <ul className="flex justify-between h-full px-6 items-center">
            {[
              { name: 'Roommates', icon: Users, id: 'roommates' },
              { name: 'Events', icon: Calendar, id: 'events' },
              { name: 'Map', icon: Map, id: 'map' },
              { name: 'Market', icon: ShoppingBag, id: 'market' },
              { name: 'More', icon: Menu, id: 'more' },
            ].map((item) => (
              <li key={item.id}>
                <button 
                  onClick={() => setActiveTab(item.id)}
                  className={`p-2 flex flex-col items-center transition-colors duration-300 ${
                    activeTab === item.id ? 'text-white' : 'text-blue-200 hover:text-white'
                  }`}
                >
                  <item.icon size={24} />
                  <span className="text-xs mt-1">{item.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        {isEditingProfile && (
          <ProfileEditModal 
            profile={userProfile} 
            onSave={(updatedProfile) => {
              setUserProfile(updatedProfile);
              setIsEditingProfile(false);
            }}
            onClose={() => setIsEditingProfile(false)}
          />
        )}
      </div>
    </div>
  );
};

const RoommatesScreen = ({ userProfile, setUserProfile }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoommate, setSelectedRoommate] = useState(null);
  const [roommates, setRoommates] = useState([
    { id: 1, name: 'Alex', major: 'Computer Science', year: 'Sophomore', interests: ['Gaming', 'Coding', 'Hiking'], profilePicture: '/api/placeholder/100/100', isMatched: false },
    { id: 2, name: 'Sam', major: 'Biology', year: 'Junior', interests: ['Reading', 'Yoga', 'Cooking'], profilePicture: '/api/placeholder/100/100', isMatched: false },
    { id: 3, name: 'Jordan', major: 'Art History', year: 'Freshman', interests: ['Painting', 'Photography', 'Traveling'], profilePicture: '/api/placeholder/100/100', isMatched: false },
    { id: 4, name: 'Taylor', major: 'Engineering', year: 'Senior', interests: ['Robotics', 'Music', 'Swimming'], profilePicture: '/api/placeholder/100/100', isMatched: false },
    { id: 5, name: 'Casey', major: 'Psychology', year: 'Junior', interests: ['Theater', 'Volunteering', 'Meditation'], profilePicture: '/api/placeholder/100/100', isMatched: false },
    { id: 6, name: 'Morgan', major: 'Business', year: 'Sophomore', interests: ['Entrepreneurship', 'Sports', 'Networking'], profilePicture: '/api/placeholder/100/100', isMatched: false },
  ]);

  const filteredRoommates = roommates.filter(roommate =>
    (roommate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    roommate.major.toLowerCase().includes(searchTerm.toLowerCase()) ||
    roommate.interests.some(interest => interest.toLowerCase().includes(searchTerm.toLowerCase())))
  );

  const handleMatch = (roommateId) => {
    setRoommates(roommates.map(roommate => 
      roommate.id === roommateId ? { ...roommate, isMatched: !roommate.isMatched } : roommate
    ));
    setUserProfile({ ...userProfile, isMatched: !userProfile.isMatched });
  };

  return (
    <div className="flex flex-col p-6">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">Find Roommates</h2>
      <div className="mb-6">
        <input 
          type="text" 
          placeholder="Search by name, major, or interests" 
          className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="space-y-4 mb-6">
        {filteredRoommates.map((roommate) => (
          <div key={roommate.id} className="bg-white p-4 rounded-xl shadow-md border border-gray-100 transition-shadow hover:shadow-lg flex items-center">
            <img src={roommate.profilePicture} alt={roommate.name} className="w-12 h-12 rounded-full mr-4" />
            <div className="flex-grow">
              <p className="text-blue-700 font-semibold">{roommate.name} - {roommate.major}</p>
              <p className="text-gray-600">{roommate.year}</p>
              <button 
                className="mt-2 text-red-500 hover:text-red-600 transition-colors"
                onClick={() => setSelectedRoommate(roommate)}
              >
                View Profile
              </button>
            </div>
            {roommate.isMatched && (
              <span className="bg-green-100 text-green-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                Matched
              </span>
            )}
          </div>
        ))}
      </div>
      {selectedRoommate && (
        <RoommateProfileModal 
          roommate={selectedRoommate} 
          onClose={() => setSelectedRoommate(null)}
          onMatch={() => handleMatch(selectedRoommate.id)}
          isMatched={selectedRoommate.isMatched}
        />
      )}
    </div>
  );
};

const RoommateProfileModal = ({ roommate, onClose, onMatch, isMatched }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
    <div className="bg-white p-6 rounded-xl max-w-sm w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-blue-800">{roommate.name}'s Profile</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>
      <img src={roommate.profilePicture} alt={roommate.name} className="w-24 h-24 rounded-full mx-auto mb-4" />
      <p><strong>Major:</strong> {roommate.major}</p>
      <p><strong>Year:</strong> {roommate.year}</p>
      <p><strong>Interests:</strong> {roommate.interests.join(', ')}</p>
      <button 
        className={`mt-4 w-full ${isMatched ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'} text-white p-3 rounded-xl transition-colors`}
        onClick={onMatch}
      >
        {isMatched ? 'Unmatch' : 'Match'} with {roommate.name}
      </button>
    </div>
  </div>
);

const EventsScreen = ({ userProfile }) => {
  const [events, setEvents] = useState([
    { id: 1, title: 'Campus Movie Night', date: '2024-07-26', time: '8:00 PM', location: 'Student Center', rsvps: [] },
    { id: 2, title: 'Volunteer Fair', date: '2024-07-27', time: '10:00 AM', location: 'Quad', rsvps: [] },
    { id: 3, title: 'Study Group - CS101', date: '2024-07-28', time: '2:00 PM', location: 'Library Room 202', rsvps: [] },
    { id: 4, title: 'Club Rush', date: '2024-07-29', time: '11:00 AM', location: 'Main Hall', rsvps: [] },
    { id: 5, title: 'Guest Lecture: AI and Ethics', date: '2024-07-30', time: '4:00 PM', location: 'Auditorium', rsvps: [] },
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const addEvent = (newEvent) => {
    setEvents([...events, { ...newEvent, id: events.length + 1, rsvps: [] }]);
    setShowAddEventModal(false);
    setNotification("New event added successfully!");
  };

  const handleRSVP = (eventId) => {
    setEvents(events.map(event => 
      event.id === eventId 
        ? { ...event, rsvps: event.rsvps.includes(userProfile.id) 
            ? event.rsvps.filter(id => id !== userProfile.id) 
            : [...event.rsvps, userProfile.id] }
        : event
    ));
    setNotification("You will be notified with more details about this event when they are available.");
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  return (
    <div className="flex flex-col p-6">
      <h2 className="text-3xl font-bold text-blue-800 mb-6">Campus Events</h2>
      <button 
        className="mb-4 bg-blue-500 text-white p-2 rounded-xl flex items-center justify-center"
        onClick={() => setShowAddEventModal(true)}
      >
        <Plus size={20} className="mr-2" /> Add New Event
      </button>
      <div className="space-y-4 mb-6">
        {events.map((event) => (
          <div key={event.id} className="bg-white p-4 rounded-xl shadow-md border border-gray-100 transition-shadow hover:shadow-lg">
            <h3 className="text-lg font-semibold text-blue-700">{event.title}</h3>
            <p className="text-gray-600">{event.date} at {event.time}</p>
            <p className="text-gray-600">{event.location}</p>
            <button 
              className="mt-2 text-red-500 hover:text-red-600 transition-colors"
              onClick={() => setSelectedEvent(event)}
            >
              View Details
            </button>
          </div>
        ))}
      </div>
      {selectedEvent && (
        <EventDetailsModal 
          event={selectedEvent} 
          onClose={() => setSelectedEvent(null)} 
          onRSVP={handleRSVP}
          userProfile={userProfile}
        />
      )}
      {showAddEventModal && (
        <AddEventModal onClose={() => setShowAddEventModal(false)} onAddEvent={addEvent} />
      )}
      {notification && (
        <div className="fixed bottom-20 left-0 right-0 mx-auto max-w-md bg-green-500 text-white p-4 rounded-t-xl">
          {notification}
        </div>
      )}
    </div>
  );
};

const EventDetailsModal = ({ event, onClose, onRSVP, userProfile }) => {
  const isRSVPed = event.rsvps.includes(userProfile.id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-xl max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-blue-800">{event.title}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Time:</strong> {event.time}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <button 
          className={`mt-4 w-full ${isRSVPed ? 'bg-green-500 hover:bg-green-600' : 'bg-blue-500 hover:bg-blue-600'} text-white p-3 rounded-xl transition-colors flex items-center justify-center`}
          onClick={() => onRSVP(event.id)}
        >
          {isRSVPed ? <><Check size={20} className="mr-2" /> RSVP Confirmed</> : 'RSVP to Event'}
        </button>
      </div>
    </div>
  );
};

const AddEventModal = ({ onClose, onAddEvent }) => {
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    address: '' // New field for address
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddEvent(newEvent);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-xl max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-blue-800">Add New Event</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ... other fields ... */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={newEvent.address}
              onChange={(e) => setNewEvent({...newEvent, address: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors"
          >
            Add Event
          </button>
        </form>
      </div>
    </div>
  );
};

const ProfileEditModal = ({ profile, onSave, onClose }) => {
  const [editedProfile, setEditedProfile] = useState(profile);

  const handleSave = () => {
    onSave(editedProfile);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-xl max-w-sm w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-blue-800">Edit Profile</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={editedProfile.name}
              onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Major</label>
            <input
              type="text"
              value={editedProfile.major}
              onChange={(e) => setEditedProfile({...editedProfile, major: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Year</label>
            <select
              value={editedProfile.year}
              onChange={(e) => setEditedProfile({...editedProfile, year: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            >
              <option value="">Select Year</option>
              <option value="Freshman">Freshman</option>
              <option value="Sophomore">Sophomore</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Interests (comma-separated)</label>
            <input
              type="text"
              value={editedProfile.interests.join(', ')}
              onChange={(e) => setEditedProfile({...editedProfile, interests: e.target.value.split(',').map(i => i.trim())})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            />
          </div>
        </div>
        <button
          onClick={handleSave}
          className="mt-6 w-full bg-blue-500 text-white p-3 rounded-xl hover:bg-blue-600 transition-colors"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

const MapScreen = ({ events }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [eventMarkers, setEventMarkers] = useState([]);

  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyCX0qGpzsSJX9LnCxGExXLf5Pi4wyX_Tq8",
    libraries: ['places']
  });

  const mapRef = useRef(null);
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    setMap(map);
  }, []);

  useEffect(() => {
    if (isLoaded && events) {
      const geocoder = new window.google.maps.Geocoder();
      const markers = events.map(event => {
        return new Promise((resolve) => {
          geocoder.geocode({ address: event.address }, (results, status) => {
            if (status === 'OK') {
              resolve({
                position: results[0].geometry.location,
                event: event
              });
            } else {
              resolve(null);
            }
          });
        });
      });

      Promise.all(markers).then(results => {
        setEventMarkers(results.filter(result => result !== null));
      });
    }
  }, [isLoaded, events]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const searchNearbyPlaces = (type) => {
    if (!map || !userLocation) return;

    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location: userLocation,
      radius: 1500,
      type: [type]
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        setPlaces(results);
      }
    });
  };

  
  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="flex flex-col h-full p-4">
      <h2 className="text-3xl font-bold text-blue-800 mb-4">Campus Map</h2>
      <div className="mb-4 space-x-2">
        <button 
          onClick={getUserLocation}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Get My Location
        </button>
        <button 
          onClick={() => searchNearbyPlaces('restaurant')}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Find Restaurants
        </button>
        <button 
          onClick={() => searchNearbyPlaces('cafe')}
          className="bg-yellow-500 text-white px-4 py-2 rounded"
        >
          Find Cafes
        </button>
      </div>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: '400px' }}
        center={userLocation || { lat: 0, lng: 0 }}
        zoom={14}
        onLoad={onMapLoad}
      >
        {userLocation && <Marker position={userLocation} />}
        {places.map((place) => (
          <Marker
            key={place.place_id}
            position={place.geometry.location}
            onClick={() => setSelectedPlace(place)}
            icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
          />
        ))}
        {eventMarkers.map((marker, index) => (
          <Marker
            key={index}
            position={marker.position}
            onClick={() => setSelectedPlace(marker.event)}
            icon="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          />
        ))}
        {selectedPlace && (
          <InfoWindow
            position={selectedPlace.geometry ? selectedPlace.geometry.location : selectedPlace.position}
            onCloseClick={() => setSelectedPlace(null)}
          >
            <div>
              <h3 className="font-bold">{selectedPlace.name || selectedPlace.title}</h3>
              <p>{selectedPlace.vicinity || selectedPlace.address}</p>
              {selectedPlace.rating && <p>Rating: {selectedPlace.rating}</p>}
              {selectedPlace.date && <p>Date: {selectedPlace.date}</p>}
              {selectedPlace.time && <p>Time: {selectedPlace.time}</p>}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
};


const MarketScreen = () => (
  <div className="flex flex-col p-6">
    <h2 className="text-3xl font-bold text-blue-800 mb-6">Marketplace</h2>
    <p>Marketplace functionality coming soon!</p>
  </div>
);

const MoreScreen = () => (
  <div className="flex flex-col p-6">
    <h2 className="text-3xl font-bold text-blue-800 mb-6">More Options</h2>
    <p>Additional features coming soon!</p>
  </div>
);

export default App;