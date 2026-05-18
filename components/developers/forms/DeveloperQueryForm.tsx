'use client';

import { useQueryState, parseAsString } from 'nuqs';
import { SelectField } from '@/components/shared/select-field';
import { useClient } from '@/hooks/use-client';
import { ALL_PROPERTY_STATUSES_VALUE, PROPERTY_STATUS_FILTER_OPTIONS } from '@/types/enums';

const DeveloperQueryForm = () => {
  const isClient = useClient();

  const [status, setStatus] = useQueryState(
    'status',
    parseAsString.withDefault('').withOptions({
      shallow: false,
      history: 'push',
    }),
  );

  const [, setPage] = useQueryState(
    'page',
    parseAsString.withDefault('1').withOptions({
      shallow: false,
      history: 'push',
    }),
  );

  const handleStatusChange = (value: string) => {
    setStatus(value === ALL_PROPERTY_STATUSES_VALUE ? null : value);
    setPage(null);
  };

  if (!isClient) return null;
  return (
    <div className="max-w-sm">
      <SelectField options={PROPERTY_STATUS_FILTER_OPTIONS} value={status || ALL_PROPERTY_STATUSES_VALUE} onValueChange={handleStatusChange} placeholder="Select Status" className="bg-white" />
    </div>
  );
};

export default DeveloperQueryForm;
