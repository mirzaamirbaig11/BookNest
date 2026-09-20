'use client';

import { SelectHTMLAttributes } from 'react';

// Server Components can't attach onChange handlers directly to <select>.
// This tiny Client Component wraps <select> so the surrounding filter form
// can auto-submit when the user picks a new option.
export default function AutoSubmitSelect(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      onChange={(e) => {
        e.currentTarget.form?.submit();
      }}
    />
  );
}
