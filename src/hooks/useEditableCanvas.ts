import React from "react"

export function useEditableCanvas(props: {
  cols: number
  rows: number
  size: number
}) {
  const { cols, rows, size } = props

  const [width, _setWidth] = React.useState<number>(cols * size)
  const [height, _setHeight] = React.useState<number>(rows * size)
  const [enableFill, _setEnableFill] = React.useState<boolean>(false)
  const [color, _setColor] = React.useState<string>("#fff")

  const [palette, setPalette] = React.useState<Record<string, string>>({})

  const ref = React.useRef<HTMLCanvasElement>(null)

  const setEnableFill = (value: boolean) => _setEnableFill(value)
  const setColor = (value: string) => _setColor(value)

  function mouseMove(e: React.MouseEvent<HTMLCanvasElement>) {
    e.preventDefault()
    if (!enableFill) return
    mouseHandler(e)
  }

  function mouseHandler(e: React.MouseEvent<HTMLCanvasElement>) {
    if (!ref.current) return

    const x = e.clientX - ref.current.offsetLeft
    const y = e.clientY - ref.current.offsetTop

    if (e.buttons === 1) {
      draw(x, y)
    } else if (e.buttons === 2) {
      clear(x, y)
    }
  }

  function mouseDown(e: React.MouseEvent<HTMLCanvasElement>) {
    e.preventDefault()
    setEnableFill(true)
    mouseHandler(e)
  }

  React.useEffect(() => {
    function mouseUp(e: MouseEvent) {
      e.preventDefault()
      setEnableFill(false)
    }

    document.addEventListener("mouseup", mouseUp)

    return () => {
      document.removeEventListener("mouseup", mouseUp)
    }
  }, [])

  function draw(x: number, y: number) {
    if (!ref.current) return
    const ctx = ref.current.getContext("2d")
    if (!ctx) return

    const xIndex = Math.floor(x / size)
    const yIndex = Math.floor(y / size)

    if (!palette[color]) {
      setPalette(prev => ({
        ...prev,
        [color]: color
      }))
    }

    ctx.fillStyle = color
    ctx.fillRect(xIndex * size, yIndex * size, size, size)
  }

  function clear(x: number, y: number) {
    if (!ref.current) return
    const ctx = ref.current.getContext("2d")
    if (!ctx) return

    const xIndex = Math.floor(x / size)
    const yIndex = Math.floor(y / size)
    ctx.clearRect(xIndex * size, yIndex * size, size, size)
  }

  function reset() {
    if (!ref.current) return
    const ctx = ref.current.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)
    setPalette({})
    setColor("#fff")
  }


  return {
    mouseMove,
    mouseDown,
    ref,
    width,
    height,
    setColor,
    reset,
    color,
    palette
  }
}
