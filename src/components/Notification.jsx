import React from 'react'
import { X, Trash2 } from 'lucide-react'

export default function Notification({ showNotification, setShowNotification, notifications = [], setNotifications = () => {} }) {
  const toggleReadStatus = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: !notif.read } : notif
      )
    )
  }

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
  }

  const deleteAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter(n => !n.read).length

  if (!showNotification) return null

  return (
    <>
      {/* Mobile Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={() => setShowNotification(false)}></div>
      
      {/* Notification Panel */}
      <div className="fixed inset-0 z-50 flex items-start justify-end md:justify-end pt-0 md:pt-0 md:inset-auto md:right-0 md:top-0 md:bottom-0 md:w-96">
        <div className="bg-white w-full h-full md:rounded-l-2xl overflow-hidden flex flex-col shadow-2xl md:shadow-lg" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-lg md:text-xl font-bold text-gray-900">Notifications</h2>
            <p className="text-xs md:text-sm text-gray-600 mt-1">You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
          </div>
          <button
            onClick={() => setShowNotification(false)}
            className="text-gray-400 hover:text-gray-600 transition p-1 md:p-2"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`p-4 md:p-5 transition ${notif.read ? 'bg-gray-50' : 'bg-blue-50'} hover:bg-gray-100`}
                >
                  <div className="flex gap-3">
                    {/* Indicator Dot */}
                    <div className="flex-shrink-0 pt-1">
                      <div className={`w-2.5 h-2.5 rounded-full ${
                        notif.type === 'security' ? 'bg-red-500' :
                        notif.type === 'transaction' ? 'bg-green-500' :
                        'bg-blue-500'
                      }`}></div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm md:text-base">{notif.title}</h3>
                      <p className="text-gray-600 text-xs md:text-sm mt-1 line-clamp-2">{notif.description}</p>
                      <p className="text-gray-500 text-xs mt-2">{notif.timestamp}</p>
                    </div>

                    {/* Read/Unread Toggle */}
                    <button
                      onClick={() => toggleReadStatus(notif.id)}
                      className={`flex-shrink-0 w-3 h-3 rounded-full transition mt-1 ${
                        notif.read ? 'bg-blue-500' : 'border-2 border-blue-400 hover:bg-blue-100'
                      }`}
                      title={notif.read ? 'Mark as unread' : 'Mark as read'}
                    />

                    {/* Delete Button */}
                    <button
                      onClick={() => deleteNotification(notif.id)}
                      className="flex-shrink-0 text-gray-400 hover:text-red-500 transition p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-32 text-gray-500">
              <p className="text-sm">No notifications</p>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        {notifications.length > 0 && (
          <div className="border-t border-gray-200 p-4 md:p-5 bg-gray-50 flex gap-3">
            <button
              onClick={markAllAsRead}
              className="flex-1 px-4 py-2.5 text-gray-700 border-2 border-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-100 transition active:bg-gray-200 min-h-11"
            >
              Mark All as Read
            </button>
            <button
              onClick={deleteAll}
              className="flex-1 px-4 py-2.5 text-gray-700 border-2 border-gray-300 rounded-lg font-semibold text-sm hover:bg-gray-100 transition active:bg-gray-200 min-h-11"
            >
              Delete All
            </button>
          </div>
        )}
      </div>
      </div>
    </>
  )
}
