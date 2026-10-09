class dailysubj:
    def __init__(self, subj, elap=0):
        self.subj = subj
        self.elap = elap

    def to_dict(self):
        return {
            "subj": self.subj,
            "elap": self.elap
        }

    @property
    def showminute(self):
        return self._elap

    @property.setter
    def addminute(self):
        self._elap += 1
    