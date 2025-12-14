function CheckboxGroup({ legend, options, selected, onToggle }) {
  return (
    <fieldset>
      <legend>{legend}</legend>
      {options.map((opt) => (
        <label key={opt} style={{ display: "block" }}>
          <input
            type="checkbox"
            checked={selected.includes(opt)}
            onChange={() => onToggle(opt)}
          />
          {opt}
        </label>
      ))}
    </fieldset>
  );
}

export default function FiltersPanel({
  seriesOptions,
  selectedSeries,
  onToggleSeries,
  sideOptions,
  selectedSides,
  onToggleSide,
  typeOptions,
  selectedTypes,
  onToggleType,
}) {
  return (
    <div className="filters">
      <CheckboxGroup
        legend="Serie"
        options={seriesOptions}
        selected={selectedSeries}
        onToggle={onToggleSeries}
      />
      <CheckboxGroup
        legend="Side"
        options={sideOptions}
        selected={selectedSides}
        onToggle={onToggleSide}
      />
      <CheckboxGroup
        legend="Type"
        options={typeOptions}
        selected={selectedTypes}
        onToggle={onToggleType}
      />
    </div>
  );
}