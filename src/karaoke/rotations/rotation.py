from datetime import datetime

class Rotation:
    def __init__(self, rotation_id):
        self.rotation_id = rotation_id
        self.singers = []
        self._current_singer_index = 0
        self.performance_date = datetime.utcnow()    
    
    @property
    def current_singer(self):
        if len(self.singers) == 0: 
            return None
        else:
            return self.singers[self._current_singer_index]


    def add_singer(self, singer):
        if singer in self.singers:
            raise ValueError(f'Singer {singer} already in rotation.')

        self.singers.append(singer)


    def complete_performance(self):
        if self._current_singer_index == len(self.singers) -1:
            self._current_singer_index = 0
        else:
            self._current_singer_index += 1

    
    def remove_singer(self, singer):
        if singer not in self.singers:
            raise ValueError(f'Singer {singer} not in rotation, cannot be removed.')

        if self.singers.index(singer) < self._current_singer_index:
            self._current_singer_index -=1
        
        if (self.singers.index(singer) == self._current_singer_index and
            self.singers.index(singer) == len(self.singers) -1):
            self._current_singer_index = 0

        self.singers = [s for s in self.singers if s != singer]
