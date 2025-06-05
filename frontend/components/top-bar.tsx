"use client"

import Image from "next/image"

export function TopBar() {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 bg-green-100 border-b border-gray-200 z-50">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-3">
          <Image
            src="/images/udsm-logo.png"
            alt="University of Dar es Salaam"
            width={40}
            height={40}
            className="object-contain"
          />
          <div>
            <p className="text-lg font-bold text-gray-900">University of Dar es Salaam</p>
            <p className="text-sm text-gray-600">UDSM</p>
          </div>
        </div>

        <div className="flex-1 text-center">
          <h1 className="text-xl font-bold text-gray-900">Scientific Data Management and Archiving Portal</h1>
          {/*<p className="text-sm text-gray-600">Kagera Basin Climate Data</p>*/}
        </div>

        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">College of Engineering and Technology</p>
          <p className="text-sm text-gray-600">CoET</p>
        </div>
      </div>
    </div>
  )
}
