import { useState } from 'react'
import Multiselect from 'multiselect-react-dropdown'

function DropDown({
  placeholder,
  showCheckBox,
  isObject,
  options,
  selectedValues,
  onRemove,
  onSelect,
  displayValue
}) {
  return (
    <span>
      <Multiselect
        placeholder={placeholder}
        showCheckbox={showCheckBox}
        isObject={isObject}
        options={options}
        selectedValues={selectedValues}
        onRemove={onRemove}
        onSelect={onSelect}
        displayValue={displayValue}
      />
    </span>
  )
}

export default DropDown
