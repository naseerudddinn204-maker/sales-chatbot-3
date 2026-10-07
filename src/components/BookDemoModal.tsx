import React, { useState } from 'react';
import { callBackend } from '../lib/backendApi';

interface BookDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (bookingDetails: { date: string; time: string; name: string }) => void;
}

export const BookDemoModal: React.FC<BookDemoModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [selectedDate, setSelectedDate] = useState('2026-10-07');
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [timezone, setTimezone] = useState('America/New_York (EST)');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('custom-architecture');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const dates = [
    { label: 'Mon, Oct 5', value: '2026-10-05' },
    { label: 'Tue, Oct 6', value: '2026-10-06' },
    { label: 'Wed, Oct 7', value: '2026-10-07' },
    { label: 'Thu, Oct 8', value: '2026-10-08' },
  ];

  const timeSlots = [
    '09:30 AM',
    '11:00 AM',
    '02:00 PM',
    '03:30 PM',
    '05:00 PM',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await callBackend({
        action: 'booking',
        name: name || 'Valued Partner',
        email,
        date: selectedDate,
        time: selectedTime,
        timezone,
        topic,
      });

      onSuccess({
        date: selectedDate,
        time: selectedTime,
        name: name || 'Valued Partner',
      });
      onClose();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Unable to book the demo. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 max-h-[90vh]">
        {/* Header */}
        <div className="px-5 py-4 bg-[#f0f3ff] border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#fee2e2] text-[#991b1b] flex items-center justify-center">
              <span className="material-symbols-outlined text-[22px]">calendar_month</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-base text-gray-900 leading-tight">
                Schedule 1-on-1 Architecture Call
              </h3>
              <p className="text-xs text-gray-500">15-minute tailored technical walkthrough</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-gray-200/60 flex items-center justify-center text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Architect Bio snippet */}
        <div className="p-4 bg-gray-50/80 border-b border-gray-200 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
            TC
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-900">Taylor Chen</span>
              <span className="text-[10px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">Staff AI Architect</span>
            </div>
            <p className="text-[11px] text-gray-500">Specializes in high-traffic retail & SaaS enterprise integrations.</p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4">
          {/* Select Date */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Select Day</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {dates.map((d) => (
                <button
                  type="button"
                  key={d.value}
                  onClick={() => setSelectedDate(d.value)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    selectedDate === d.value
                      ? 'border-[#0266ff] bg-blue-50 text-[#0266ff] shadow-xs'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Select Time Slot */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Available Time Slot</label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setSelectedTime(slot)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                    selectedTime === slot
                      ? 'border-[#d61616] bg-red-50 text-[#d61616] shadow-xs'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {/* Timezone */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Timezone</label>
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0266ff]"
            >
              <option value="America/New_York (EST)">Eastern Time (US & Canada) - EST</option>
              <option value="America/Chicago (CST)">Central Time - CST</option>
              <option value="America/Los_Angeles (PST)">Pacific Time - PST</option>
              <option value="Europe/London (GMT)">London / Dublin - GMT</option>
              <option value="Asia/Singapore (SGT)">Singapore / Tokyo - SGT</option>
            </select>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Henderson"
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0266ff]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Work Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0266ff]"
              />
            </div>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Discussion Focus</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full h-10 px-3 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:outline-none focus:border-[#0266ff]"
            >
              <option value="custom-architecture">Enterprise Architecture & Custom Security</option>
              <option value="zendesk-migration">Migration from Zendesk/Intercom</option>
              <option value="sales-conversions">E-commerce Conversions & Autonomous Cart Recovery</option>
              <option value="pricing-volume">Volume Pricing & Dedicated SLA Guarantee</option>
            </select>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 rounded-xl bg-[#d61616] hover:bg-[#bd1313] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99] cursor-pointer mt-2"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
                <span>Confirming Timeslot...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">event_available</span>
                <span>Confirm 15-min Discovery Call</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
