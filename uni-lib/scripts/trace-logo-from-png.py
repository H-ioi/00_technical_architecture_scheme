"""Trace logo PNG into pure vector SVG (currentColor)."""
from __future__ import annotations

import math
from pathlib import Path

from PIL import Image

SOURCE = Path(__file__).resolve().parents[1] / "src" / "icons" / "svg" / "logo-source.png"
OUTPUT = Path(__file__).resolve().parents[1] / "src" / "icons" / "svg" / "logo.svg"
VIEWBOX_W = 1024
VIEWBOX_H = 919


def is_filled(r: int, g: int, b: int, a: int) -> bool:
    return a > 40 and (r + g + b) > 30


def load_mask(image: Image.Image) -> list[list[bool]]:
    pixels = image.load()
    width, height = image.size
    return [
        [is_filled(*pixels[x, y]) for x in range(width)]
        for y in range(height)
    ]


def find_components(mask: list[list[bool]]) -> list[set[tuple[int, int]]]:
    height = len(mask)
    width = len(mask[0])
    visited: set[tuple[int, int]] = set()
    components: list[set[tuple[int, int]]] = []

    for y in range(height):
        for x in range(width):
            if not mask[y][x] or (x, y) in visited:
                continue
            stack = [(x, y)]
            component: set[tuple[int, int]] = set()
            while stack:
                cx, cy = stack.pop()
                if (cx, cy) in component or cx < 0 or cy < 0 or cx >= width or cy >= height:
                    continue
                if not mask[cy][cx]:
                    continue
                component.add((cx, cy))
                stack.extend([(cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)])
            components.append(component)
            visited |= component

    return sorted(components, key=lambda item: min(point[0] for point in item))


def trace_outline(
    component: set[tuple[int, int]],
    width: int,
    height: int,
) -> list[tuple[float, float]]:
    edges: set[tuple[tuple[int, int], tuple[int, int]]] = set()

    for x, y in component:
        if y == 0 or (x, y - 1) not in component:
            edges.add(((x, y), (x + 1, y)))
        if y == height - 1 or (x, y + 1) not in component:
            edges.add(((x + 1, y + 1), (x, y + 1)))
        if x == 0 or (x - 1, y) not in component:
            edges.add(((x, y + 1), (x, y)))
        if x == width - 1 or (x + 1, y) not in component:
            edges.add(((x + 1, y), (x + 1, y + 1)))

    adjacency: dict[tuple[int, int], list[tuple[int, int]]] = {}
    for start, end in edges:
        adjacency.setdefault(start, []).append(end)

    start = min(edges)[0]
    current = start
    path = [current]
    used: set[tuple[tuple[int, int], tuple[int, int]]] = set()

    for _ in range(len(edges) + 5):
        options = adjacency.get(current, [])
        next_point = None
        for option in options:
            edge = (current, option)
            if edge not in used:
                next_point = option
                used.add(edge)
                break
        if next_point is None:
            break
        path.append(next_point)
        current = next_point
        if current == start:
            break

    return [(float(x), float(y)) for x, y in path]


def sample_points(points: list[tuple[float, float]], count: int) -> list[tuple[float, float]]:
    if len(points) <= count:
        return points

    step = len(points) / count
    sampled = [points[0]]
    index = step
    while len(sampled) < count - 1:
        sampled.append(points[int(index)])
        index += step
    sampled.append(points[-1])
    return sampled


def catmull_rom_beziers(points: list[tuple[float, float]]) -> list[str]:
    if len(points) < 2:
        return []

    padded = [points[0]] + points + [points[-1]]
    commands: list[str] = [f"M {points[0][0]:.2f} {points[0][1]:.2f}"]

    for index in range(1, len(padded) - 2):
        p0, p1, p2, p3 = padded[index - 1 : index + 3]
        cp1 = (p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6)
        cp2 = (p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6)
        commands.append(
            f"C {cp1[0]:.2f} {cp1[1]:.2f} {cp2[0]:.2f} {cp2[1]:.2f} {p2[0]:.2f} {p2[1]:.2f}"
        )

    commands.append("Z")
    return commands


def component_bounds(component: set[tuple[int, int]]) -> tuple[int, int, int, int]:
    xs = [point[0] for point in component]
    ys = [point[1] for point in component]
    return min(xs), min(ys), max(xs), max(ys)


def is_bar(component: set[tuple[int, int]]) -> bool:
    min_x, min_y, max_x, max_y = component_bounds(component)
    width = max_x - min_x + 1
    height = max_y - min_y + 1
    return width / height < 0.25


def bar_rect(component: set[tuple[int, int]]) -> str:
    min_x, min_y, max_x, max_y = component_bounds(component)
    return (
        f'  <rect x="{min_x}" y="{min_y}" width="{max_x - min_x + 1}" '
        f'height="{max_y - min_y + 1}" fill="currentColor" />'
    )


def trapezoid_path(component: set[tuple[int, int]]) -> str:
    rows: dict[int, tuple[int, int]] = {}
    for x, y in component:
        left, right = rows.get(y, (x, x))
        rows[y] = (min(left, x), max(right, x))

    top_y = min(rows)
    bottom_y = max(rows)
    top_left, top_right = rows[top_y]
    bottom_left, bottom_right = rows[bottom_y]
    path = (
        f"M {top_left} {top_y} L {top_right} {top_y} "
        f"L {bottom_right} {bottom_y} L {bottom_left} {bottom_y} Z"
    )
    return f'  <path fill="currentColor" d="{path}" />'


def curve_path(outline: list[tuple[float, float]], samples: int) -> str:
    anchor = sample_points(outline, samples)
    commands = catmull_rom_beziers(anchor)
    return f'  <path fill="currentColor" d="{" ".join(commands)}" />'


def main() -> None:
    image = Image.open(SOURCE).convert("RGBA")
    mask = load_mask(image)
    components = find_components(mask)

    if len(components) != 3:
        raise RuntimeError(f"Expected 3 logo components, got {len(components)}")

    shapes: list[str] = []
    for component in components:
        if is_bar(component):
            shapes.append(bar_rect(component))
            continue

        outline = trace_outline(component, VIEWBOX_W, VIEWBOX_H)
        min_x, _, max_x, _ = component_bounds(component)
        center_x = (min_x + max_x) / 2

        if center_x > 700:
            shapes.append(trapezoid_path(component))
        else:
            shapes.append(curve_path(outline, samples=36))

    svg = "\n".join(
        [
            f'<svg viewBox="0 0 {VIEWBOX_W} {VIEWBOX_H}" xmlns="http://www.w3.org/2000/svg" fill="none" shape-rendering="geometricPrecision">',
            *shapes,
            "</svg>",
            "",
        ]
    )
    OUTPUT.write_text(svg, encoding="utf-8")
    print(f"written {OUTPUT}")


if __name__ == "__main__":
    main()
