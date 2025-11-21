import React, { useState } from 'react';
import { Search, Calendar, Users, Plus, Minus, Menu, X } from 'lucide-react';

export default function HotelHomepage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [guests, setGuests] = useState({
    rooms: 0,
    adults: 0,
    children: 0
  });

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const formatDate = (date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Oct', 'Nov', 'Des'];
    return {
      day: days[date.getDay()],
      date: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
    };
  };

  const checkIn = formatDate(today);
  const checkOut = formatDate(tomorrow);

  const updateGuest = (type, operation) => {
    setGuests(prev => ({
      ...prev,
      [type]: operation === 'add' ? prev[type] + 1 : Math.max(0, prev[type] - 1)
    }));
  };

  const handleSearch = () => {
    alert('Pencarian hotel sedang diproses...');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">H</span>
              </div>
              <span className="text-xl font-semibold text-blue-600">Hotello</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition">
                Home
              </a>
              <a href="#" className="text-gray-700 text-sm font-medium hover:text-blue-600 transition">
                Deals
              </a>
              <a href="#" className="text-gray-700 text-sm font-medium hover:text-blue-600 transition">
                About
              </a>
            </div>

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center gap-4 text-sm font-medium">
              <button className="text-blue-600 hover:opacity-70 transition">Sign Up</button>
              <span className="text-gray-300">|</span>
              <button className="text-blue-600 hover:opacity-70 transition">Login</button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-3 space-y-3">
              <a href="#" className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium text-center">
                Home
              </a>
              <a href="#" className="block text-gray-700 text-sm font-medium hover:text-blue-600">
                Deals
              </a>
              <a href="#" className="block text-gray-700 text-sm font-medium hover:text-blue-600">
                About
              </a>
              <div className="flex justify-center items-center gap-3 pt-2 border-t">
                <button className="text-blue-600 text-sm font-medium">Sign Up</button>
                <span className="text-gray-300">|</span>
                <button className="text-blue-600 text-sm font-medium">Login</button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/50 to-blue-600/50"></div>
        </div>

        {/* Search Box */}
        <div className="absolute inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 md:p-10 w-full max-w-5xl">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 text-center mb-6 sm:mb-8">
              Hai, mau nginep di mana?
            </h1>

            <div className="space-y-5">
              {/* Search Input */}
              <div className="relative">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari kota tujuan"
                  className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-full text-sm focus:outline-none focus:border-blue-600 transition"
                />
              </div>

              {/* Date and Guest Controls */}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Check-in & Check-out */}
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  {/* Check-in */}
                  <button
                    type="button"
                    className="flex-1 flex flex-col items-start p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 transition text-left"
                  >
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                      <Calendar size={14} />
                      <span>Check-in</span>
                    </div>
                    <div className="text-xs text-gray-400">{checkIn.day}</div>
                    <div className="text-sm font-medium text-gray-800">{checkIn.date}</div>
                  </button>

                  {/* Check-out */}
                  <button
                    type="button"
                    className="flex-1 flex flex-col items-start p-4 border-2 border-gray-200 rounded-xl hover:border-blue-600 transition text-left"
                  >
                    <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
                      <Calendar size={14} />
                      <span>Check-out</span>
                    </div>
                    <div className="text-xs text-gray-400">{checkOut.day}</div>
                    <div className="text-sm font-medium text-gray-800">{checkOut.date}</div>
                  </button>
                </div>

                {/* Guest Section */}
                <div className="flex-1 flex flex-wrap sm:flex-nowrap items-center justify-between gap-4 p-4 border-2 border-gray-200 rounded-xl">
                  {/* Rooms */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">Kamar</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateGuest('rooms', 'subtract')}
                        className="w-8 h-8 border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white hover:border-blue-600 transition flex items-center justify-center"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-base font-medium w-6 text-center">{guests.rooms}</span>
                      <button
                        type="button"
                        onClick={() => updateGuest('rooms', 'add')}
                        className="w-8 h-8 border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white hover:border-blue-600 transition flex items-center justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Adults */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">Dewasa</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateGuest('adults', 'subtract')}
                        className="w-8 h-8 border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white hover:border-blue-600 transition flex items-center justify-center"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-base font-medium w-6 text-center">{guests.adults}</span>
                      <button
                        type="button"
                        onClick={() => updateGuest('adults', 'add')}
                        className="w-8 h-8 border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white hover:border-blue-600 transition flex items-center justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-gray-500 font-medium">Anak</span>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => updateGuest('children', 'subtract')}
                        className="w-8 h-8 border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white hover:border-blue-600 transition flex items-center justify-center"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="text-base font-medium w-6 text-center">{guests.children}</span>
                      <button
                        type="button"
                        onClick={() => updateGuest('children', 'add')}
                        className="w-8 h-8 border border-gray-300 rounded-md hover:bg-blue-600 hover:text-white hover:border-blue-600 transition flex items-center justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <button
                onClick={handleSearch}
                className="w-full py-4 bg-blue-600 text-white rounded-full text-base font-semibold hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 transition-all"
              >
                Cari
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}