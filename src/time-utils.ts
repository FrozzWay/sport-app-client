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
    d.setHours(0,0,0,0)
    let day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6:1);
    return new Date(d.setDate(diff));
  }
