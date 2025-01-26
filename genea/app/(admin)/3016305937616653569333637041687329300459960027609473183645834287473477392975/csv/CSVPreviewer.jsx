"use client"

import React, { useState } from "react"

export default function CSVPreviewer({ csvData, headers }) {
  return (
    <>
      {csvData.length > 0 && (
        <table className=" text-sm rounded-md">
          <thead>
            <tr className="border-b text-left dark:border-neutral-700 ">
              {headers.map((header, index) => (
                <th key={index} className="pl-6 py-2 font-semibold">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="align-baseline text-gray-900 dark:text-gray-100">
            {csvData.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-gray-100 dark:border-neutral-700/50 align-middle"
              >
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="py-2 pl-6">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  )
}
