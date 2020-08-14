import { Global, jsx } from '@emotion/core'
import { version } from 'heroicons/package.json'
import React, { useEffect, useState, useRef, ChangeEvent } from 'react'
// @ts-ignore
import { selectMenu } from 'figma-plugin-ds'
import 'figma-plugin-ds/dist/figma-plugin-ds.css'
import ReactDOM from 'react-dom'
import IconButton from './components/icon-button'
import SearchInput from './components/search-input'
import theme from './theme'
import './ui.css'
import useSearch from './use-search'
import { iconsObject } from './icons'

function App() {
  const ref = useRef<HTMLSelectElement>(null)
  const [query, setQuery] = React.useState('')
  const [type, setType] = useState<'all' | 'outline' | 'solid'>('all')
  const results = useSearch(query, type)

  useEffect(() => {
    selectMenu.init()
  }, [])

  useEffect(() => {
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) =>
      setType(e.target.value as any)
    if (ref.current) {
      // @ts-ignore
      ref.current.addEventListener('change', handleChange)
    }

    return () => {
      if (ref.current) {
        // @ts-ignore
        ref.current.removeEventListener('change', handleChange)
      }
    }
  }, [ref])

  return (
    <div
      style={{
        minHeight: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      <Global
        styles={{ body: { margin: 0, fontFamily: 'Inter, sans-serif' } }}
      />
      <SearchInput
        iconCount={Object.keys(iconsObject[type]).length}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        css={{
          position: 'sticky',
          top: 0,
          borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
        }}
      />
      <div style={{ padding: '4px 10px 0 10px' }}>
        <select ref={ref} id="typeSelect" className="select-menu">
          <option value="all">All</option>
          <option value="outline">Outline</option>
          <option value="solid">Solid</option>
        </select>
      </div>
      <div
        css={{
          padding: theme.space[2],
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {results.length ? (
          <div
            css={{
              display: 'grid',
              gridTemplateColumns: 'repeat(6, 1fr)',
              gridGap: theme.space[1],
            }}
          >
            {results.map((icon) => (
              <IconButton type={type} key={icon} name={icon} />
            ))}
          </div>
        ) : (
          <div
            css={{
              paddingTop: theme.space[5],
              paddingBottom: theme.space[5],
              fontSize: theme.fontSizes[1],
              color: 'rgba(0, 0, 0, 0.5)',
              textAlign: 'center',
            }}
          >
            No icons found for this query
          </div>
        )}
        <div
          css={{
            padding: theme.space[2],
            paddingTop: theme.space[2] * 2,
            marginTop: 'auto',
            fontSize: theme.fontSizes[0],
            color: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          Heroicons v{version}
        </div>
      </div>
    </div>
  )
}

ReactDOM.render(<App />, document.getElementById('root'))
