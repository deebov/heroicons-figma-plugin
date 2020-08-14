// @ts-ignore
import * as HeroiconsOutline from 'heroicons/react/outline/index.js'
// @ts-ignore
import * as HeroiconsSolid from 'heroicons/react/solid/index.js'

const getNamedOutlineIcons = () => {
  const icons: any = {}
  Object.keys(HeroiconsOutline).forEach(
    (key) => (icons[`${key}Outline`] = HeroiconsOutline[key]),
  )
  return icons
}

export const OutlineIcons = getNamedOutlineIcons()

export const SolidIcons = HeroiconsSolid

const sortObjectKeys = (obj: any) => {
  const sortedObj: any = {}
  Object.keys(OutlineIcons)
    .concat(Object.keys(SolidIcons))
    .sort()
    .forEach((key) => (sortedObj[key] = obj[key]))
  return sortedObj
}

export const AllIcons = sortObjectKeys({ ...OutlineIcons, ...SolidIcons })

export const iconsObject = {
  all: AllIcons,
  outline: OutlineIcons,
  solid: SolidIcons,
}
