import Fuse from 'fuse.js'
import React from 'react'
import { OutlineIcons, SolidIcons, AllIcons } from './icons'
const outlineKeys = Object.keys(OutlineIcons)
const solidKeys = Object.keys(SolidIcons)
const allKeys = Object.keys(AllIcons)

const keys = { all: allKeys, outline: outlineKeys, solid: solidKeys }

function useSearch(query: string, type: 'all' | 'outline' | 'solid') {
  const [results, setResults] = React.useState(keys[type])
  const fuse = new Fuse(keys[type], {
    threshold: 0.2,
  })

  React.useEffect(() => {
    if (query.trim()) {
      setResults(fuse.search(query.trim()).map((i: any) => keys[type][i]))
    } else {
      setResults(keys[type])
    }
  }, [query, type])

  return results
}

export default useSearch
