export class Friend {
  constructor ({ lastName, firstName, dateOfBirth, email }) {
    this.lastName = lastName;
    this.firstName = firstName;
    this.dateOfBirth = new Date(...dateOfBirth.split('/'));
    this.email = email;
  }
}
