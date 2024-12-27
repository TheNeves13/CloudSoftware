#!/usr/bin/env python3
import sys

current_year = None
current_count = 0

print(f"{'Year':<15}{'Count':<10}")
print("=" * 25)

for line in sys.stdin:
    line = line.strip()

    try:
        year, count = line.split("\t")
        count = int(count)
    except ValueError:
        continue

    if current_year == year:
        current_count += count
    else:
        if current_year is not None:
            print(f"{current_year:<15}{current_count:<10}")
        current_year = year
        current_count = count

if current_year is not None:
    print(f"{current_year:<15}{current_count:<10}")

