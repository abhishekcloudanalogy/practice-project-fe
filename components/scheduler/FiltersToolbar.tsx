"use client";

import Input from "@/components/common/Input";
import Select from "@/components/common/Select";
import Button from "@/components/common/Button";
import { SearchOutlined } from "@/components/common/antd/icons";
import { statusOptions, departmentOptions } from "@/components/scheduler/constants";
import { useSchedulerFilters } from "@/components/scheduler/useSchedulerFilters";
import { useGetUserDirectoryQuery } from "@/store/services/user/apiSlice";
import {
  FiltersContainer,
  FilterField,
  FilterSelect,
  FilterLabel,
  ClearButton,
} from "@/components/scheduler/FiltersToolbar.styles";

export default function FiltersToolbar() {
  const { filters, setFilters, resetFilters } = useSchedulerFilters();
  const { data: directory = [] } = useGetUserDirectoryQuery();

  const organizerOptions = [
    { value: "All", label: "All" },
    ...directory.map((user) => ({ value: user.id, label: user.name ?? user.email })),
  ];

  const filtersActive =
    Boolean(filters.search.trim()) ||
    filters.status !== "All" ||
    filters.department !== "All" ||
    filters.organizerId !== "All";

  return (
    <FiltersContainer>
      <FilterField>
        <Input
          allowClear
          prefix={<SearchOutlined />}
          placeholder="Search meetings or people"
          value={filters.search}
          onChange={(event) => setFilters({ search: event.target.value })}
          style={{ width: "100%" }}
        />
      </FilterField>

      <FilterSelect>
        <FilterLabel>Status</FilterLabel>
        <Select
          style={{ width: "100%" }}
          value={filters.status}
          options={statusOptions.map((status) => ({ value: status, label: status }))}
          onChange={(status) => setFilters({ status })}
        />
      </FilterSelect>

      <FilterSelect>
        <FilterLabel>Department</FilterLabel>
        <Select
          style={{ width: "100%" }}
          value={filters.department}
          options={["All", ...departmentOptions].map((department) => ({ value: department, label: department }))}
          onChange={(department) => setFilters({ department })}
        />
      </FilterSelect>

      <FilterSelect>
        <FilterLabel>Organizer</FilterLabel>
        <Select
          style={{ width: "100%" }}
          value={filters.organizerId}
          options={organizerOptions}
          onChange={(organizerId) => setFilters({ organizerId })}
        />
      </FilterSelect>

      {filtersActive ? (
        <ClearButton>
          <Button type="text" onClick={resetFilters}>
            Clear filters
          </Button>
        </ClearButton>
      ) : null}
    </FiltersContainer>
  );
}