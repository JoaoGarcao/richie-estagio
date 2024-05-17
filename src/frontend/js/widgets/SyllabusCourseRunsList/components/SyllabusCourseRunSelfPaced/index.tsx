import { defineMessages, FormattedMessage, useIntl } from 'react-intl';
import { CourseRun, CourseRunDisplayMode } from 'types';
import useDateFormat from 'hooks/useDateFormat';
import { extractResourceId, isJoanieResourceLinkProduct } from 'api/lms/joanie';
import { findLmsBackend } from 'api/configuration';
import { StringHelper } from 'utils/StringHelper';
import { IntlHelper } from 'utils/IntlHelper';
import { DjangoCMSPluginCourseRun, DjangoCMSTemplate } from 'components/DjangoCMSTemplate';
import { CourseLight } from 'types/Joanie';
import CourseRunEnrollment from '../CourseRunEnrollment';
import CourseProductItem from '../CourseProductItem';

const messages = defineMessages({
  enrollment: {
    id: 'components.SyllabusCourseRun.enrollment',
    description: 'Title of the enrollment dates section of an opened course run block',
    defaultMessage: 'Enrollment',
  },
  languages: {
    id: 'components.SyllabusCourseRun.languages',
    description: 'Title of the languages section of an opened course run block',
    defaultMessage: 'Languages',
  },
  selfPaceRunPeriod: {
    id: 'components.SyllabusCourseRun.selfPaceEnrollmentPeriod',
    description: 'Enrollment date of an opened and self paced course run block',
    defaultMessage: 'Available until {endDate}',
  },
});

// const OnlyOneLanguage = ({ courseRun }: { courseRun: CourseRun }) => { // Alterar, verificar se todas as versões do curso têm as mesmas línguas disponíveis, caso negativo: aparece languages, caso afirmativo: não aparece nada.
//   return (courseRun.languages.length == 1);
// }

const OpenedSelfPacedCourseRun = ({ courseRun }: { courseRun: CourseRun }) => {
  const formatDate = useDateFormat();
  const intl = useIntl();
  const enrollmentEnd = courseRun.enrollment_end ? formatDate(courseRun.enrollment_end) : '...';
  return (
    <>
      {courseRun.title && <h3>{StringHelper.capitalizeFirst(courseRun.title)}</h3>}
      <dl>
        <dt>
          <FormattedMessage {...messages.enrollment} />
        </dt>
        <dd>
          <FormattedMessage
            {...messages.selfPaceRunPeriod}
            values={{
              endDate: enrollmentEnd,
            }}
          />
        </dd>
        <dt><FormattedMessage {...messages.languages} /></dt>
        <dd>{IntlHelper.getLocalizedLanguages(courseRun.languages, intl)}</dd>
      </dl>
      {findLmsBackend(courseRun.resource_link) ? (
        <CourseRunEnrollment courseRun={courseRun} />
      ) : (
        <a className="course-run-enrollment__cta" href={courseRun.resource_link}>
          {StringHelper.capitalizeFirst(courseRun.state.call_to_action)}
        </a>
      )}
    </>
  );
};

export const SyllabusCourseRunSelfPaced = ({
  courseRun,
  course,
}: {
  courseRun: CourseRun;
  course: CourseLight;
}) => {
  return (
    <DjangoCMSTemplate plugin={DjangoCMSPluginCourseRun(courseRun)}>
      <div className="course-detail__run-descriptions course-detail__run-descriptions--course_and_search">
        {isJoanieResourceLinkProduct(courseRun.resource_link) ? (
          <CourseProductItem
            productId={extractResourceId(courseRun.resource_link, 'product')!}
            course={course}
            compact={courseRun.display_mode === CourseRunDisplayMode.COMPACT}
          />
        ) : (
          <OpenedSelfPacedCourseRun courseRun={courseRun} />
        )}
      </div>
    </DjangoCMSTemplate>
  );
};