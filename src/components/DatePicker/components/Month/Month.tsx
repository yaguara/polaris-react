import * as React from 'react';
import {
  Range,
  Weekdays,
  isDateBefore,
  isDateAfter,
  isSameDay,
  getWeeksForMonth,
  dateIsInRange,
  dateIsSelected,
  getNewRange,
} from '@shopify/javascript-utilities/dates';
import {autobind} from '@shopify/javascript-utilities/decorators';
import {noop} from '@shopify/javascript-utilities/other';
import {classNames} from '@shopify/react-utilities/styles';
import {withAppProvider, WithAppProviderProps} from '../../../AppProvider';
import * as styles from '../../DatePicker.scss';
import Day from '../Day';
import Weekday from '../Weekday';

export interface Props {
  locale?: string;
  focusedDate?: Date;
  selected?: Range;
  hoverDate?: Date;
  visibleMonth: Date;
  disableDatesBefore?: Date;
  disableDatesAfter?: Date;
  allowRange?: Boolean;
  weekStartsOn: Weekdays;
  onChange?(date: Range): void;
  onHover?(hoverEnd: Date): void;
  onFocus?(date: Date): void;
}

export type CombinedProps = Props & WithAppProviderProps;

const WEEKDAYS = [
  Weekdays.Sunday,
  Weekdays.Monday,
  Weekdays.Tuesday,
  Weekdays.Wednesday,
  Weekdays.Thursday,
  Weekdays.Friday,
  Weekdays.Saturday,
];

export class Month extends React.PureComponent<CombinedProps, never> {
  render() {
    const {locale = 'en', visibleMonth, weekStartsOn} = this.props;
    const now = new Date();
    const current =
      now.getMonth() === visibleMonth.getMonth() &&
      now.getFullYear() === visibleMonth.getFullYear();

    const className = classNames(
      styles.Title,
      current && styles['Month-current'],
    );

    const weeks = getWeeksForMonth(
      visibleMonth.getMonth(),
      visibleMonth.getFullYear(),
      weekStartsOn,
    );

    const weekdayFormat = Intl.DateTimeFormat(locale, {weekday: 'short'});
    const weekdays = getWeekdaysOrdered(weekStartsOn).map((weekday) => {
      // October 1, 2017 is a Sunday
      const arbitraryWeekdayDate = new Date(2017, 9, weekday + 1);

      return (
        <Weekday
          key={weekday}
          title={weekdayFormat.format(arbitraryWeekdayDate)}
          current={current && new Date().getDay() === weekday}
          label={weekday}
        />
      );
    });

    const weeksMarkup = weeks.map((week, index) => (
      <div role="row" className={styles.Week} key={index}>
        {week.map(this.renderWeek)}
      </div>
    ));

    return (
      <div role="grid" className={styles.Month}>
        <div className={className}>
          {Intl.DateTimeFormat(locale, {month: 'long', year: 'numeric'}).format(
            visibleMonth,
          )}
        </div>
        <div role="rowheader" className={styles.WeekHeadings}>
          {weekdays}
        </div>
        {weeksMarkup}
      </div>
    );
  }

  @autobind
  handleDateClick(selectedDate: Date) {
    const {onChange, allowRange, selected} = this.props;

    if (onChange) {
      onChange(getNewRange(allowRange && selected, selectedDate));
    }
  }

  @autobind
  renderWeek(day: Date, dayIndex: number) {
    const {
      locale = 'en',
      focusedDate,
      selected,
      hoverDate,
      disableDatesBefore,
      disableDatesAfter,
      allowRange,
      onHover = noop,
      onFocus = noop,
      visibleMonth,
    } = this.props;

    if (day == null) {
      const lastDayOfMonth = new Date(
        visibleMonth.getFullYear(),
        visibleMonth.getMonth() + 1,
        0,
      );
      return (
        <Day
          key={dayIndex}
          // eslint-disable-next-line react/jsx-no-bind
          onHover={onHover.bind(null, lastDayOfMonth)}
          locale={locale}
        />
      );
    }

    const disabled =
      (disableDatesBefore && isDateBefore(day, disableDatesBefore)) ||
      (disableDatesAfter && isDateAfter(day, disableDatesAfter));

    const isInHoveringRange = allowRange ? hoveringDateIsInRange : () => false;

    return (
      <Day
        locale={locale}
        focused={focusedDate != null && isSameDay(day, focusedDate)}
        day={day}
        key={dayIndex}
        onFocus={onFocus}
        onClick={this.handleDateClick}
        onHover={onHover}
        selected={selected != null && dateIsSelected(day, selected)}
        inRange={selected != null && dateIsInRange(day, selected)}
        disabled={disabled}
        inHoveringRange={
          selected != null &&
          hoverDate != null &&
          isInHoveringRange(day, selected, hoverDate)
        }
      />
    );
  }
}

function hoveringDateIsInRange(
  day: Date | null,
  range: Range,
  hoverEndDate: Date,
) {
  if (day == null) {
    return false;
  }
  const {start, end} = range;
  return Boolean(isSameDay(start, end) && day > start && day <= hoverEndDate);
}

function getWeekdaysOrdered(weekStartsOn: Weekdays): Weekdays[] {
  const weekDays = [...WEEKDAYS];
  const restOfDays = weekDays.splice(weekStartsOn);
  return [...restOfDays, ...weekDays];
}

export default withAppProvider<Props>()(Month);
