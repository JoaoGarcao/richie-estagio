import { CourseRun } from 'types';

export const IsAllCorseRunsWithSameLanguages = (courseRuns: CourseRun[]) => {
  var languages = courseRuns[0].languages.sort();
  for(var i = 1; i < courseRuns.length; i++) {
    var runLanguages = courseRuns[i].languages.sort();
    if(!(runLanguages.length === languages.length) || !(runLanguages.every((value, index) => value === languages[index]))) {
      return false;
    }
  }
  return true;
}