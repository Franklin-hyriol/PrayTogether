import React from 'react'

type Props = {
    className?: string
}

function ComponentsLoader({ className }: Props) {
    return (
        <div className="w-full h-full flex justify-center items-center">
            <span className={`loading loading-spinner loading-xl ${className}`}></span>
        </div>
    )
}

export default ComponentsLoader;