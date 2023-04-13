export function next_mo(): Date {
  let date = this_mo()
  date.setDate(date.getDate() + 7)
  return date
}

export function this_mo(): Date {
  return getMonday(new Date())
}

export function getMonday(d: Date) {
  d = new Date(d)
  d.setHours(0, 0, 0, 0)
  let day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1);
  return new Date(d.setDate(diff));
}

export function today(): number {
  let date = new Date()
  date.setHours(0, 0, 0, 0);
  return date.getTime()
}

export function add_days(dates: Date[], nw: boolean) {
    for (let day = 0; day < 7; day++) {
      let date = (!nw) ? this_mo() : next_mo()
      date.setDate(date.getDate() + day)
      dates.push(date)
    }
  }
