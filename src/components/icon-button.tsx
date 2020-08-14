import React, { useEffect, useRef } from 'react'
import { jsx } from '@emotion/core'
import theme from '../theme'
import { iconsObject } from '../icons'

interface IconButtonProps {
  name: string
  type: 'all' | 'outline' | 'solid'
}

function IconButton({ name, type }: IconButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    let offsetX = 0
    let offsetY = 0
    const handleDragStart = (e: any) => {
      offsetX = e.offsetX
      offsetY = e.offsetY
    }
    const handleDragEnd = (e: any) => {
      // Don't proceed if the item was dropped inside the plugin window.
      if (e.view.length === 0) return

      // Getting the position of the cursor relative to the top-left corner of the browser page (Where the hamburger icon is)
      const dropPosition = {
        clientX: e.clientX,
        clientY: e.clientY,
      }

      // Getting the size of the app/browser window.
      const windowSize = {
        width: window.outerWidth,
        height: window.outerHeight,
      }

      // These are the offsets set from the dragstart event.
      const offset = {
        x: offsetX,
        y: offsetY,
      }

      const itemSize = {
        width: e.target.clientWidth,
        height: e.target.clientHeight,
      }

      // Sending the variables over to the main code.
      window.parent.postMessage(
        {
          pluginMessage: {
            isDragged: true,
            dropPosition,
            windowSize,
            offset,
            itemSize,
            type: name,
          },
        },
        '*',
      )
    }

    if (ref.current) {
      ref.current.addEventListener('dragstart', handleDragStart)
      ref.current.addEventListener('dragend', handleDragEnd)
    }

    return () => {
      if (ref.current) {
        ref.current.removeEventListener('dragstart', handleDragStart)
        ref.current.removeEventListener('dragend', handleDragEnd)
      }
    }
  }, [])

  const isOutline = name.endsWith('Outline') || type === 'outline'

  return (
    <button
      ref={ref}
      draggable={true}
      key={name}
      aria-label={name}
      onClick={() => parent.postMessage({ pluginMessage: { type: name } }, '*')}
      css={{
        padding: theme.space[2],
        color: '#333',
        background: 'transparent',
        border: 0,
        borderRadius: theme.radii[1],
        appearance: 'none',
        outline: 0,
        // transition: 'background 50ms ease-in-out',
        '&:hover': {
          background: 'rgba(0, 0, 0, 0.06)',
        },
        '&:focus, &:active': {
          boxShadow: `inset 0 0 0 2px ${theme.colors.blue}`,
        },
      }}
    >
      {!!iconsObject[type][name] &&
        React.createElement(iconsObject[type][name], {
          width: 24,
          height: 24,
          stroke: !isOutline ? 'none' : 'currentColor',
          fill: !isOutline ? 'currentColor' : 'none',
          viewBox: '0 0 24 24',
        })}
    </button>
  )
}

export default IconButton
