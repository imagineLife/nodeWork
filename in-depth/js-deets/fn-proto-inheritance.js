const human = {
  // Default val
  name: 'Joe',
  sayName: function(){ console.log(`Hey, my "this.name" is ${this.name}`)},
  jobText: `I don't have a job`,
  sayJob: function(){ console.log(this.jobText) }
}

// Extend the human object into a teacher
/*
  leveraging the Object.create(sourceObject, propertyDescriptorObject) 
  method
*/

const teacherObjDescriptor = {
  name: {
    value: 'Michael'
  },
  jobText: {
    value: `I teach for a living`
  }
}
const teacher = Object.create(human, teacherObjDescriptor);
human.sayName()
human.sayJob()
teacher.sayName()
teacher.sayJob()

// EXTENDING the above paradigm, with a 'createTeacher' wrapper
function createTeacher(name){
  return Object.create(teacher, {
    name: {
      value: name
    }
  })
}

const t2 = createTeacher('Blonk')
t2.sayName()
t2.sayJob()