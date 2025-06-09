import React from 'react'
import BackButton from './BackButton'

function HeadingHeader({ heading }: { heading: string }) {
    return (
        <div className="flex items-center justify-center relative pt-6 pb-4">
            <BackButton />

            <h1 className="text-lg font-semibold text-gray-500 pr-8">{heading}</h1>
        </div>
    )
}

export default HeadingHeader