import { createIntl } from 'react-intl';
import { faker } from '@faker-js/faker';
import { OpenEdxApiProfileFactory } from 'utils/test/factories/openEdx';
import { OpenEdxGender, OpenEdxLanguageIsoCode, OpenEdxLevelOfEducation } from 'types/openEdx';
import { parseOpenEdxApiProfile } from '.';

describe('useOpenEdxProfile > utils', () => {
  it('parseOpenEdxApiProfile should format values', () => {
    const profile = parseOpenEdxApiProfile(
      createIntl({ locale: 'en' }),
      OpenEdxApiProfileFactory({
        username: 'John',
        name: 'Do',
        email: 'john.do@whereis.net',
        'pref-lang': OpenEdxLanguageIsoCode.FRENCH,
        country: 'fr',
        level_of_education: OpenEdxLevelOfEducation.MASTER_OR_PROFESSIONNAL_DEGREE,
        gender: OpenEdxGender.MALE,
        year_of_birth: '01/01/1970',
        language_proficiencies: [{ code: OpenEdxLanguageIsoCode.ENGLISH }],
        date_joined: '01/01/1970',
      }).one(),
    );

    expect(profile).toStrictEqual({
      username: 'John',
      name: 'Do',
      email: 'john.do@whereis.net',
      language: 'French',
      country: 'France',
      levelOfEducation: 'Master',
      gender: 'Male',
      yearOfBirth: '01/01/1970',
      favoriteLanguage: 'English',
      dateJoined: '01/01/1970',
    });
  });

  it('parseOpenEdxApiProfile should format default values', () => {
    const profile = parseOpenEdxApiProfile(
      createIntl({ locale: 'en' }),
      OpenEdxApiProfileFactory({
        username: faker.internet.userName(),
        name: '',
        email: faker.internet.email(),
        'pref-lang': undefined,
        country: null,
        level_of_education: null,
        gender: null,
        year_of_birth: null,
        language_proficiencies: [],
        date_joined: Date.toString(),
      }).one(),
    );

    expect(profile).toStrictEqual({
      username: profile.username,
      name: ' - ',
      email: profile.email,
      language: ' - ',
      country: ' - ',
      levelOfEducation: ' - ',
      gender: ' - ',
      yearOfBirth: ' - ',
      favoriteLanguage: ' - ',
      dateJoined: profile.dateJoined,
    });
  });
});
