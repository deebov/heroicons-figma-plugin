import ReactDOMServer from 'react-dom/server'
import React from 'react'
import { AllIcons } from './icons'

figma.showUI(__html__, { width: 300, height: 400 })

figma.ui.onmessage = (message) => {
  console.log(message)

  const icon = figma.createNodeFromSvg(
    ReactDOMServer.renderToStaticMarkup(
      React.createElement(AllIcons[message.type]),
    ),
  )

  icon.name = message.type

  const { dropPosition, windowSize, offset, isDragged } = message

  if (isDragged) {
    // Getting the position and size of the visible area of the canvas.
    const bounds = figma.viewport.bounds

    // Getting the zoom level
    const zoom = figma.viewport.zoom

    // There are two states of the Figma interface: With or without the UI (toolbar + left and right panes)
    // The calculations would be slightly different, depending on whether the UI is shown.
    // So to determine if the UI is shown, we'll be comparing the bounds to the window's width.
    // Math.round is used here because sometimes bounds.width * zoom may return a floating point number very close but not exactly the window width.
    const hasUI = Math.round(bounds.width * zoom) !== windowSize.width

    // Since the left pane is resizable, we need to get its width by subtracting the right pane and the canvas width from the window width.
    const leftPaneWidth = windowSize.width - bounds.width * zoom - 240

    // Getting the position of the cursor relative to the top-left corner of the canvas.
    const xFromCanvas = hasUI
      ? dropPosition.clientX - leftPaneWidth
      : dropPosition.clientX
    const yFromCanvas = hasUI ? dropPosition.clientY - 40 : dropPosition.clientY

    // Create a rectangle
    // const rect = figma.createRectangle();

    // Resize the rectangle to be the same size as the item from the plugin window.
    // icon.resize(itemSize.width, itemSize.height);
    // figma.currentPage.appendChild(rect);

    // The canvas position of the drop point can be calculated using the following:
    icon.x = bounds.x + xFromCanvas / zoom - offset.x
    icon.y = bounds.y + yFromCanvas / zoom - offset.y

    // Select the rectangle
    figma.currentPage.selection = [icon]
    return
  }
  icon.x = figma.viewport.center.x
  icon.y = figma.viewport.center.y
  figma.currentPage.selection = [icon]
}
