#!/usr/bin/env python3
import sys

for line in sys.stdin:
    line = line.strip()

    try:

        first_comma_index = line.index(",")

        year = line[first_comma_index + 1:first_comma_index + 5]

        if year.isdigit():
            print(f"{year}\t1")
    except (ValueError, IndexError):
        continue


